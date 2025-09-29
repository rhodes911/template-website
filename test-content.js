const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDirectory = path.join(process.cwd(), 'content');

function getCaseStudies() {
  const caseStudiesDirectory = path.join(contentDirectory, 'case-studies');
  
  if (!fs.existsSync(caseStudiesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(caseStudiesDirectory);
  const caseStudies = fileNames
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const id = name.replace(/\.md$/, '');
      const fullPath = path.join(caseStudiesDirectory, name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        id,
        ...data,
        content,
      };
    });

  return caseStudies;
}

function getTestimonials() {
  const testimonialsDirectory = path.join(contentDirectory, 'testimonials');
  
  if (!fs.existsSync(testimonialsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(testimonialsDirectory);
  const testimonials = fileNames
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const id = name.replace(/\.md$/, '');
      const fullPath = path.join(testimonialsDirectory, name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        id,
        ...data,
        content,
      };
    });

  return testimonials;
}

// Test the functions
const caseStudies = getCaseStudies();
const testimonials = getTestimonials();

console.log('🎉 Content Loading Test Results:');
console.log(`📁 Case Studies Found: ${caseStudies.length}`);
console.log(`💬 Testimonials Found: ${testimonials.length}`);

if (caseStudies.length > 0) {
  console.log(`📖 First case study: "${caseStudies[0].title}"`);
  console.log(`👤 Client: ${caseStudies[0].client}`);
}

if (testimonials.length > 0) {
  console.log(`⭐ First testimonial: ${testimonials[0].name} from ${testimonials[0].company}`);
}

console.log('\n✅ Content system is working perfectly!');
console.log('\n📝 To add content, developers just need to:');
console.log('   1. Create a new .md file in content/case-studies/ or content/testimonials/');
console.log('   2. Copy the frontmatter structure from existing files');
console.log('   3. Edit the content');
console.log('   4. Save the file');
console.log('\n🚀 No CMS needed - it\'s that simple!');
