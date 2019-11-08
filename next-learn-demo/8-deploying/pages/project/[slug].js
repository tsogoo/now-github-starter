import groq from 'groq'
import imageUrlBuilder from '@sanity/image-url'
import BlockContent from '@sanity/block-content-to-react'
import client from '../../client'

function urlFor (source) {
  return imageUrlBuilder(client).image(source)
}

const Project = (props) => {
  const { 
    title = 'Missing title',
    categories,
    mainImage,
    authorImage,
    body = []
  } = props
  return (
    <article>
      <h1>{title}</h1>
      {categories && (
        <ul>
          Posted in
          {categories.map(category => <li key={category}>{category}</li>)}
        </ul>
      )}
      {authorImage && (
        <div>
          <img
            src={urlFor(authorImage)
              .width(150)
              .url()}
          />
        </div>
      )}
      {mainImage && (
        <div>
          <img
            src={urlFor(mainImage)
              //.width(150)
              .url()}
          />
        </div>
      )}
      <BlockContent
        blocks={body}
        imageOptions={{ w: 320, h: 240, fit: 'max' }}
        {...client.config()}
      />
    </article>
  )
}

Project.getInitialProps = async function(context) {
  // It's important to default the slug so that it doesn't return "undefined"
  const { slug = "" } = context.query
  const query = groq`*[_type == "post" && slug.current == $slug][0]{
    title,
    body,
    "mainImage": mainImage,
    "categories": categories[]->title,
    "authorImage": author->image
  }`
  return await client.fetch(query, { slug })
}

export default Project