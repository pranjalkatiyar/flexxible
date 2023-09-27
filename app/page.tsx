import { fetchAllProjects } from '@/lib/actions'
import Image from 'next/image'
import { ProjectInterface } from '@/common.types'
import Link from 'next/link'
import ProjectCard from './components/ProjectCard'
import { categoryFilters } from './constants'
import Categories from './components/Categories'
import LoadMore from './components/LoadMore'

type ProjectSearch = {
  projectSearch: {
    edges: { node: ProjectInterface }[]
    pageInfo: {
      hasPreviousPage: boolean
      hasNextPage: boolean
      startCursor: string
      endcursor: string
    }
  }
}

type SearchParams={
  category?:string | null;
  endcursor:string | null;
}

type Props={
  searchParams:SearchParams
}

export const dynamic='force-dynamic';
// export const dynamicPass=true;
export const revalidate=0;

const Home = async ({searchParams:{category,endcursor}}:Props) => {
  const data = await fetchAllProjects(category,endcursor) as ProjectSearch;

  const projectsToDisplay = data?.projectSearch?.edges || [];

  if (projectsToDisplay.length === 0) {
    return (
      <section className="flexStart flex-col paddings">
        Categories
        <p className='no-result-text text-center'>No projects found....</p>
      </section>
    )
  }

  const pagination=data?.projectSearch?.pageInfo;

  // console.log(projectsToDisplay);
  return (
    <section className="flex-start flex-col paddings mb-16">
      <Categories/>
      <section className="projects-grid">
        {projectsToDisplay.map(({ node }: { node: ProjectInterface }) => (<ProjectCard key={node?.id} id={node?.id} image={node?.image} title={node?.title} name={node?.createdBy?.name} avatarUrl={node?.createdBy?.avatarUrl} userId={node?.createdBy?.id} />))}
      </section>
      <LoadMore startcursor={pagination?.startCursor} endcursor={pagination?.endcursor} hasPreviousPage={pagination?.hasPreviousPage} hasNextPage={pagination?.hasNextPage}/>
    </section>
  )
}


export default Home;