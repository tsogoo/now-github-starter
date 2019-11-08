import { useEffect, useState } from 'react'
import Layout from '../components/MyLayout.js'
import Link from 'next/link'


const client = require('contentful').createClient({
  space: 'tldkmwvx004h',
  accessToken: 'rBgXMzVi3NtoHww_KzefbNiL7RN3BMIX3-wWKwIMtJE'
})



export default function HomePage() {

  async function fetchContentTypes() {
    const types = await client.getContentTypes()
    if (types.items) return types.items
    console.log('Error getting Content Types.')
  }

  async function fetchEntriesForContentType(contentType) {
    const entries = await client.getEntries({
      content_type: contentType.sys.id
    })
    if (entries.items) return entries.items
    console.log(`Error getting Entries for ${contentType.name}.`)
  }

  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function getPosts() {
      const contentTypes = await fetchContentTypes()
      const allPosts = await fetchEntriesForContentType(contentTypes[0])
      setPosts([...allPosts])
    }
    getPosts()
  }, [])

  return (
    <Layout>
      <div>
        {posts.length > 0
        ? posts.map(p => (
            <div>
              <Link href="/post/[slug]" as={`/post/${p.fields.slug}`}>{p.fields.title}</Link>
            </div>
          ))
        : null}
      </div>
      <style jsx>{`
        h1,
        a {
          font-family: 'Arial';
        }

        ul {
          padding: 0;
        }

        li {
          list-style: none;
          margin: 5px 0;
        }

        a {
          text-decoration: none;
          color: blue;
        }

        a:hover {
          opacity: 0.6;
        }
      `}</style>
    </Layout>
  )
}
