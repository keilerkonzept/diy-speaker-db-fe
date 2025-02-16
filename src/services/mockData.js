// Generate a random string of specified length
const randomString = (length) => {
  return Math.random().toString(36).substring(2, length + 2);
};

// Generate a random URL
const randomUrl = () => {
  return `https://www.${randomString(8)}.com`;
};

// Generate a random price between 10 and 1000 EUR
const randomPrice = () => {
  return Math.round((Math.random() * 990 + 10) * 100) / 100;
};

// Generate a random dimension between 1 and max
const randomDimension = (max = 100) => {
  return Math.floor(Math.random() * max) + 1;
};

// Generate a random developer name
const randomDeveloper = () => {
  const developers = [
    "John Doe",
    "Jane Smith",
    "Alice Johnson",
    "Bob Wilson",
    "Carol Brown",
    "David Miller",
    "Emma Davis",
    "Frank Thomas"
  ];
  return developers[Math.floor(Math.random() * developers.length)];
};

// Generate a random enclosure type
const randomEnclosure = () => {
  const enclosures = [
    "Closed Box",
    "Bass Reflex",
    "TQWT",
    "Horn",
    "Transmission Line",
    "Bandpass",
    "Isobaric",
    "Open Baffle"
  ];
  return enclosures[Math.floor(Math.random() * enclosures.length)];
};

// Generate a random range
const randomRange = () => {
  const ranges = [
    "Full Range",
    "Top",
    "Subwoofer"
  ];
  return ranges[Math.floor(Math.random() * ranges.length)];
};

// Generate random specialties
const randomSpecialty = () => {
  const specialties = [
    "Koax",
    "Passive Membrane",
    "Broadband",
    "AMT"
  ];
  return specialties[Math.floor(Math.random() * specialties.length)];
};

// Generate a random F3 value between 20 and 120 Hz
const randomF3 = () => {
  return Math.floor(Math.random() * 100) + 20; // Random value between 20 and 120
};

// Generate mock data
const getMockData = async (page, itemsPerPage = 20) => {
  const startIndex = (page - 1) * itemsPerPage;
  const items = [];

  for (let i = 0; i < itemsPerPage; i++) {
    items.push({
      id: startIndex + i + 1,
      name: `Item ${startIndex + i + 1} - ${randomString(4)}`,
      developer: randomDeveloper(),
      price: randomPrice(),
      enclosure: randomEnclosure(),
      range: randomRange(),
      f3: randomF3(),
      specialty: randomSpecialty(),
      height: randomDimension(),
      width: randomDimension(),
      depth: randomDimension(),
      url: randomUrl()
    });
  }

  // For debugging
  console.log('Generated items:', items);

  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(items);
    }, 500);
  });
};

export { getMockData }; 