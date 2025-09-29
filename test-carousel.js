// This would normally fail due to ES modules, but let's create a quick JS version
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function getServices() {
  const servicesDirectory = path.join(process.cwd(), 'content', 'services');
  const fileNames = fs.readdirSync(servicesDirectory);
  
  const services = fileNames
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const id = name.replace(/\.md$/, '');
      const fullPath = path.join(servicesDirectory, name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return { id, ...data };
    });

  return services.sort((a, b) => {
    if (a.order && b.order) return a.order - b.order;
    if (a.order) return -1;
    if (b.order) return 1;
    return (a.title || '').localeCompare(b.title || '');
  });
}

function getCarouselServicesTest() {
  return getServices().map(service => ({
    id: service.serviceId,
    title: service.title,
    description: service.description,
    features: (service.features || []).slice(0, 4).map(f => f?.title || ''),
  }));
}

console.log('=== CAROUSEL TEST ===');
const carouselServices = getCarouselServicesTest();
console.log(`Total services in carousel: ${carouselServices.length}`);

carouselServices.forEach((service, index) => {
  console.log(`${index + 1}. ${service.id} - ${service.title}`);
  if (service.id === 'website-design') {
    console.log('   ✅ Website Design FOUND in carousel!');
  }
});

const websiteDesignIndex = carouselServices.findIndex(s => s.id === 'website-design');
console.log(`\nWebsite Design is at index: ${websiteDesignIndex} (0-based)`);
console.log(`Website Design is at position: ${websiteDesignIndex + 1} (1-based)`);
