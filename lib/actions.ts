import {
  getUserQuery,
  createUserMutation,
  createProjectMutation,
  projectsQuery,
  getProjectByIdQuery,
  getProjectsOfUserQuery,
  deleteProjectMutation,
  updateProjectMutation,
} from "../graphql/index";
import { GraphQLClient } from "graphql-request";
import { ProjectForm } from "@/common.types";
import { categoryFilters } from "@/app/constants";

const isProduction = process.env.NODE_ENV === "production";

const apiUrl = isProduction
  ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL!
  : "http://127.0.0.1:4000/graphql";

const apiKey = isProduction ? process.env.GRAFBASE_API_KEY! : "1234567890";

const serverUrl = isProduction
  ? process.env.GRAFBASE_SERVER_URL as string: "http://localhost:3000";
const client = new GraphQLClient(apiUrl);

const makeGraphQLRequest = async (query: string, variables = {}) => {
  try {
    client.setHeader("x-api-key", apiKey);
    return await client.request(query, variables);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchToken = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/auth/token`);
    console.log(response);
    return response.json();
  } catch (err) {
    throw err;
  }
};

export const getUser = (email: string) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getUserQuery, { email });
};

export const createUser = (name: string, email: string, avatarUrl: string) => {
  const variables = {
    input: {
      name,
      email,
      avatarUrl,
    },
  };

  return makeGraphQLRequest(createUserMutation, variables);
};

export const uploadImage = async (imagePath: string) => {
  try {
    console.log(serverUrl);
    const response = await fetch(`http://localhost:3000/api/upload`, {
      method: "POST",
      body: JSON.stringify({ path: imagePath }),
    });

    return response.json();
  } catch (error) {
    throw error;
  }
};

export const createNewProject = async (
  form: ProjectForm,
  creatorId: string,
  token: string
) => {
  const imageUrl = await uploadImage(form.image);

  if (imageUrl.url) {
    client.setHeader("Authorization", `Bearer ${token}`);
    const variables = {
      input: {
        ...form,
        image: imageUrl.url,
        createdBy: {
          link: creatorId,
        },
      },
    };
    return makeGraphQLRequest(createProjectMutation, variables);
  }
};

// export const fetchToken = async () => {
//   try {
//     console.log(serverUrl);
//     const response = await fetch(`https://flexxible-tau.vercel.app/api/auth/token`);
//     return response.json();
//   } catch (error) {
//     throw error;
//   }
// };

export const fetchAllProjects = async (
  category?: string | null,
  endcursor?: string | null
) => {
  client.setHeader("x-api-key", apiKey);
  const categories = category == null ? categoryFilters : [category];
  return await makeGraphQLRequest(projectsQuery, { categories, endcursor });
};

export const getProjectDetails = (id: string) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getProjectByIdQuery, { id });
};

export const getUserProjects = async (id: string, last?: number) => {
  client.setHeader("x-api-key", apiKey);
  return makeGraphQLRequest(getProjectsOfUserQuery, { id, last });
};

export const deleteProject = async (id: string, token: string) => {
  client.setHeader("Authorization", `Bearer ${token}`);
  return makeGraphQLRequest(deleteProjectMutation, { id });
};

export const updateProject = async (
  form: ProjectForm,
  token: string,
  projectId: string
) => {
  function isBase64Url(value: string) {
    const base64Regex = /^data:image\/(png|jpg|jpeg);base64,/;
    return base64Regex.test(value);
  }

  let updatedForm = { ...form };

  const isUploadingNewImage = isBase64Url(form.image);

  if (isUploadingNewImage) {
    const imageUrl = await uploadImage(form.image);
    if (imageUrl.url) {
      updatedForm = { ...form, image: imageUrl.url };
    }
  }

  const variables = {
    id: projectId,
    input: updatedForm,
  };

  client.setHeader("Authorization", `Bearer ${token}`);
  return makeGraphQLRequest(updateProjectMutation, variables);
};
