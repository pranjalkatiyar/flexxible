import { g, auth, config } from "@grafbase/sdk";

// Welcome to Grafbase!
// Define your data models, integrate auth, permission rules, custom resolvers, search, and more with Grafbase.
// Integrate Auth
// https://grafbase.com/docs/auth
//
// const authProvider = auth.OpenIDConnect({
//   issuer: process.env.ISSUER_URL ?? ''
// })
//
// Define Data Models
// https://grafbase.com/docs/database

//@ts-ignore
const User = g
  .model("User", {
    name: g.string().length({ min: 2, max: 20 }),
    email: g.string().unique(),
    avatarUrl: g.url(),
    description: g.string().length({ min: 2, max: 100 }).optional(),
    githubUrl: g.url().optional(),
    twitterUrl: g.url().optional(),
    linkedInUrl: g.url().optional(),
    projects: g
      .relation(() => Project)
      .list()
      .optional(),
  }) .auth((rules) => {
    rules.public().read();
  });

//@ts-ignore
const Project = g
  .model("Project", {
    title: g.string().length({ min: 2, max: 20 }),
    description: g.string().length({ min: 2, max: 100 }),
    image: g.url(),
    liveSiteUrl: g.url().optional(),
    githubUrl: g.url().optional(),
    category: g.string().search(),
    createdBy: g.relation(() => User),
  })  .auth((rules) => {
    rules.public().read(), rules.private().create().update().delete();
  });


const jwt = auth.JWT({
  issuer: "grafbase",
  secret: 'c4qwiLWfZvNsCyuHpfN+WEa35N/PKpRsv2xx049dum8=',
});

export default config({
  schema: g,
  auth: {
    providers: [jwt],
    rules: (rules) => rules.private(),
  },
});
