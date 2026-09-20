import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

export function EnglishPage() {
  usePageMeta();
  return (
    <main className="container" lang="en" style={{ paddingBlock: '5rem', maxWidth: 900, lineHeight: 1.8 }}>
      <h1>Uşak technology and software developer community</h1>
      <p>localhostusak is an independent community in Uşak (Usak), Turkey, bringing together software developers, engineers, designers, students and remote workers. Bring your curiosity and your laptop: you do not need to be an expert to join the conversation.</p>
      <h2>Meet, learn and work together</h2>
      <p>Our community connects people interested in software, design and artificial intelligence. Coworking meetups are an opportunity to work on your own project, exchange ideas and meet people in the city. We are a community, not a commercial coworking office.</p>
      <p><Link to="/etkinlikler">Explore upcoming events and coworking meetups (in Turkish)</Link>. When no event has been announced, the page will show that the next meetup is coming soon.</p>
      <h2>Software projects and engineering careers in Uşak</h2>
      <p>Discover <Link to="/projeler">community projects and open-source collaborations</Link> or browse <Link to="/kariyer">shared jobs, internships and career opportunities</Link>. Opportunities appear when community content is published; availability varies.</p>
      <h2>Everyone starts somewhere</h2>
      <p>Whether you are studying engineering, building your first website or working remotely in Uşak, this is a place to connect with people who enjoy learning and building together.</p>
      <p><Link to="/" lang="tr">Türkçe topluluk sayfası</Link></p>
    </main>
  );
}
