const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDirectory = path.join(process.cwd(), 'content');

function getServices() {
  const servicesDirectory = path.join(contentDirectory, 'services');
  
  if (!fs.existsSync(servicesDirectory)) {
    console.log('Services directory does not exist:', servicesDirectory);
    return [];
  }

  const fileNames = fs.readdirSync(servicesDirectory);
  console.log('Service files found:', fileNames);
  
  const services = fileNames
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const id = name.replace(/\.md$/, '');
      const fullPath = path.join(servicesDirectory, name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      const service = {
        id,
        ...data,
        content,
      };
      
      console.log(`Service ${id}:`, {
        serviceId: service.serviceId,
        title: service.title,
        order: service.order,
        featured: service.featured
      });
      
      return service;
    });

  // Sort by order if specified, then by title
  return services.sort((a, b) => {
    if (a.order && b.order) {
      return a.order - b.order;
    }
    if (a.order) return -1;
    if (b.order) return 1;
    
    const titleA = a.title || '';
    const titleB = b.title || '';
    return titleA.localeCompare(titleB);
  });
}

function getCarouselServices() {
  return getServices().map(service => ({
    id: service.serviceId,
    title: service.title,
    description: service.description,
    features: (service.features || []).slice(0, 4).map(f => f?.title || ''),
  }));
}

console.log('=== ALL SERVICES ===');
const allServices = getServices();
allServices.forEach((service, index) => {
  console.log(`${index + 1}. ${service.serviceId} - ${service.title} (order: ${service.order})`);
});

console.log('\n=== CAROUSEL SERVICES ===');
const carouselServices = getCarouselServices();
carouselServices.forEach((service, index) => {
  console.log(`${index + 1}. ${service.id} - ${service.title}`);
});

console.log('\n=== WEBSITE DESIGN DETAILS ===');
const websiteDesign = allServices.find(s => s.serviceId === 'website-design');
if (websiteDesign) {
  console.log('Found website-design service:', {
    serviceId: websiteDesign.serviceId,
    title: websiteDesign.title,
    order: websiteDesign.order,
    featured: websiteDesign.featured,
    hasFeatures: !!websiteDesign.features,
    featuresCount: websiteDesign.features?.length || 0
  });
} else {
  console.log('website-design service NOT FOUND');
}
