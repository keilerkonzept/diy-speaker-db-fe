<script>
import { proxyImage } from './utils/imageProxy';
import EditItemDialog from './components/EditItemDialog.vue';
import CompareWidget from './components/CompareWidget.vue';


export default {
  name: "App",
  components: {
    EditItemDialog,
    CompareWidget
  },
  data() {
    return {
      items: [],
      displayedItems: [],
      proxyImage,
      activeTab: this.getInitialTab(), // Get tab from URL or default to 'hifi'
      dataSources: {
        hifi: "https://sheets.googleapis.com/v4/spreadsheets/1PoYey8POjJOA-ucpMtjJpdDWmXww5tK5HlhHbNeUZrs/values/hifi-live?alt=json&key=AIzaSyCi5Azx-KvH8rfE3oTlRERkchMcSH-9dvA",
        'hifi-commercial': "https://sheets.googleapis.com/v4/spreadsheets/1PoYey8POjJOA-ucpMtjJpdDWmXww5tK5HlhHbNeUZrs/values/hifi-commercial-live?alt=json&key=AIzaSyCi5Azx-KvH8rfE3oTlRERkchMcSH-9dvA",
        pa: "https://sheets.googleapis.com/v4/spreadsheets/1PoYey8POjJOA-ucpMtjJpdDWmXww5tK5HlhHbNeUZrs/values/pa-live?alt=json&key=AIzaSyCi5Azx-KvH8rfE3oTlRERkchMcSH-9dvA",
        'pa-commercial': "https://sheets.googleapis.com/v4/spreadsheets/1PoYey8POjJOA-ucpMtjJpdDWmXww5tK5HlhHbNeUZrs/values/pa-commercial-live?alt=json&key=AIzaSyCi5Azx-KvH8rfE3oTlRERkchMcSH-9dvA"
      },
      columnConfigs: {
        hifi: [
          { key: 'image', label: 'Popular', width: 'min-w-[70pt] w-[70pt]' },
          { key: 'name', label: 'Name', width: 'min-w-[120pt] w-[250pt]' },
          { key: 'developer', label: 'Developer', width: 'min-w-[100pt] w-[200pt]' },
          { key: 'price', label: 'Price', width: 'min-w-[70pt] w-[70pt]' },
          { key: 'enclosure', label: 'Enclosure', width: 'min-w-[80pt] w-[100pt]' },
          { key: 'type', label: 'Type', width: 'min-w-[80pt] w-[90pt]' },
          { key: 'f3', label: 'F₃', width: 'min-w-[60pt] w-[60pt]' },
          { key: 'sensitivity', label: 'SPL', width: 'min-w-[60pt] w-[60pt]' },
          { key: 'specialty', label: 'Specialty', width: 'min-w-[80pt] w-[120pt]' },
          { key: 'dimensions', label: 'H × W × D', width: 'min-w-[20pt] w-[20pt]' },
          { key: 'volume', label: 'Volume', width: 'w-[30pt]' }
        ],
        'hifi-commercial': [
          { key: 'image', label: 'Popular', width: 'min-w-[70pt] w-[70pt]' },
          { key: 'name', label: 'Name', width: 'min-w-[120pt] w-[250pt]' },
          { key: 'developer', label: 'Developer', width: 'min-w-[100pt] w-[200pt]' },
          { key: 'price', label: 'Price', width: 'min-w-[70pt] w-[70pt]' },
          { key: 'enclosure', label: 'Enclosure', width: 'min-w-[80pt] w-[100pt]' },
          { key: 'type', label: 'Type', width: 'min-w-[80pt] w-[90pt]' },
          { key: 'f3', label: 'F₃', width: 'min-w-[60pt] w-[60pt]' },
          { key: 'sensitivity', label: 'SPL', width: 'min-w-[60pt] w-[60pt]' },
          { key: 'specialty', label: 'Specialty', width: 'min-w-[80pt] w-[120pt]' },
          { key: 'dimensions', label: 'H × W × D', width: 'min-w-[20pt] w-[20pt]' },
          { key: 'volume', label: 'Volume', width: 'w-[30pt]' }
        ],
        pa: [
          { key: 'image', label: 'Popular', width: 'min-w-[70pt] w-[70pt]' },
          { key: 'name', label: 'Name', width: 'min-w-[120pt] w-[250pt]' },
          { key: 'developer', label: 'Developer', width: 'min-w-[100pt] w-[200pt]' },
          { key: 'price', label: 'Price', width: 'min-w-[40pt] w-[40pt]' },
          { key: 'enclosure', label: 'Enclosure', width: 'min-w-[80pt] w-[100pt]' },
          { key: 'type', label: 'Type', width: 'min-w-[80pt] w-[90pt]' },
          { key: 'f3', label: 'F₃', width: 'min-w-[60pt] w-[60pt]' },
          { key: 'sensitivity', label: 'SPL', width: 'min-w-[60pt] w-[60pt]' },
          { key: 'power', label: 'Power', width: 'min-w-[60pt] w-[60pt]' },
          { key: 'range', label: 'Range', width: 'min-w-[80pt] w-[100pt]' },
          { key: 'dispersion', label: 'Dispersion', width: 'min-w-[80pt] w-[100pt]' },
          { key: 'specialty', label: 'Specialty', width: 'min-w-[80pt] w-[120pt]' },
          { key: 'dimensions', label: 'H × W × D', width: 'min-w-[20pt] w-[20pt]' },
          { key: 'volume', label: 'Volume', width: 'w-[30pt]' }
        ],
        'pa-commercial': [
          { key: 'image', label: 'Popular', width: 'min-w-[70pt] w-[70pt]' },
          { key: 'name', label: 'Name', width: 'min-w-[120pt] w-[250pt]' },
          { key: 'developer', label: 'Developer', width: 'min-w-[100pt] w-[200pt]' },
          { key: 'price', label: 'Price', width: 'min-w-[40pt] w-[40pt]' },
          { key: 'enclosure', label: 'Enclosure', width: 'min-w-[80pt] w-[100pt]' },
          { key: 'type', label: 'Type', width: 'min-w-[80pt] w-[90pt]' },
          { key: 'f3', label: 'F₃', width: 'min-w-[60pt] w-[60pt]' },
          { key: 'sensitivity', label: 'SPL', width: 'min-w-[60pt] w-[60pt]' },
          { key: 'power', label: 'Power', width: 'min-w-[60pt] w-[60pt]' },
          { key: 'range', label: 'Range', width: 'min-w-[80pt] w-[100pt]' },
          { key: 'dispersion', label: 'Dispersion', width: 'min-w-[80pt] w-[100pt]' },
          { key: 'specialty', label: 'Specialty', width: 'min-w-[80pt] w-[120pt]' },
          { key: 'dimensions', label: 'H × W × D', width: 'min-w-[20pt] w-[20pt]' },
          { key: 'volume', label: 'Volume', width: 'w-[30pt]' }
        ]
      },
      showDimensionsDialog: false,
      availableEnclosures: [
        "Closed Box",
        "CB w Series Cap",
        "Bass Reflex",
        "TQWT",
        "Horn",
        "Tapped Horn",
        "Transmission Line",
        "Bandpass",
        "Isobaric",
        "Open Baffle",
        "FAST"
      ],
      availableTypesHifi: ["Floor", "Compact", "Subwoofer", "Wall"],
      availableTypesPa: ["Subwoofer", "Top", "Line Array"],
      availableSpecialties: ["Koax", "Passive Membrane", "Broadband", "AMT", "D'Appolito"],
      filters: {
        popular: false,
        name: "",
        price: null,
        enclosures: [],
        types: [],
        specialties: [],
        height: null,
        width: null,
        depth: null,
        volume: null,
        developer: "",
        f3: null,
        sensitivity: null,
        power: null,
        range: "",
        dispersion: "",
      },

      showEditDialog: false,
      editingItem: {},
      isNewEntry: false,

      selectedEnclosure: "",
      selectedType: "",
      selectedSpecialty: "",
      cachedItems: {
        'hifi': [],
        'hifi-commercial': [],
        'pa': [],
        'pa-commercial': []
      },
      tabCounts: {
        'hifi': 0,
        'hifi-commercial': 0,
        'pa': 0,
        'pa-commercial': 0
      },
      copiedMessage: "",
      copiedSpeaker: null,
      compareItems: []
    };
  }, // end data()
  computed: {
    copiedSpeakerId() {
      return 'speaker-' + encodeURIComponent(this.copiedSpeaker?.replace(/\s+/g, '-').toLowerCase());
    }
  },
  methods: {
    getInitialTab() {
      // Get tab from URL query parameter
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');

      // Check if the tab parameter exists and is valid
      if (tabParam && ['hifi', 'hifi-commercial', 'pa', 'pa-commercial'].includes(tabParam)) {
        return tabParam;
      }

      // Default to 'hifi' if no valid tab parameter
      return 'hifi';
    },

    updateUrlWithTab(tab) {
      // Update URL without reloading the page
      const url = new URL(window.location);
      url.searchParams.set('tab', tab);
      window.history.pushState({}, '', url);
    },

    async loadAllData() {
      try {
        // Load data for all tabs
        const tabs = Object.keys(this.dataSources);

        // Create an array of promises for parallel loading
        const loadPromises = [];

        for (const tab of tabs) {
          if (this.cachedItems[tab].length === 0) {
            // Add promise to array without awaiting it yet
            loadPromises.push(this.loadTabData(tab));
          }
        }

        // Wait for all promises to resolve in parallel
        if (loadPromises.length > 0) {
          await Promise.all(loadPromises);
        }

        // Set items based on active tab
        this.items = [...this.cachedItems[this.activeTab]];
        this.applyFilters();

        // Return a resolved promise to allow chaining
        return Promise.resolve();
      } catch (error) {
        alert("Error loading data: " + error.message);
        return Promise.reject(error);
      }
    },

    /**
     * API reference:
     * https://developers.google.com/sheets/api/reference/rest
     * 
     * The spreadsheet needs to be shared as:
     * "File > Share > Share with others > anyone with the link can view".
     * 
     * Request limits:
     * https://developers.google.com/sheets/api/limits
     */
    async loadTabData(tab) {
      try {
        const url = this.dataSources[tab];
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        json.values.shift(); // remove header row

        const items = [];

        json.values.forEach((item) => {
          var row = {};
          if (tab.includes('hifi')) {
            row = {
              name: item[0],
              developer: item[1],
              price: item[2].length > 0 ? parseFloat(item[2]) : null,
              enclosure: item[3],
              type: item[4],
              f3: item[5].length > 0 ? parseFloat(item[5]) : null,
              sensitivity: item[6].length > 0 ? parseFloat(item[6]) : null,
              specialty: item[7],
              height: item[8].length > 0 ? parseFloat(item[8]) : null,
              width: item[9].length > 0 ? parseFloat(item[9]) : null,
              depth: item[10].length > 0 ? parseFloat(item[10]) : null,
              url: item[11],
              image_url: item[12],
              score: item[13],
              popular: item[14] === "TRUE",
            };
          }

          // Add PA-specific fields if we're on the PA tab
          if (tab.startsWith('pa')) {
            row = {
              name: item[0],
              developer: item[1],
              price: item[2].length > 0 ? parseFloat(item[2]) : null,
              enclosure: item[3],
              type: item[4],
              f3: item[5].length > 0 ? parseFloat(item[5]) : null,
              sensitivity: item[6].length > 0 ? parseFloat(item[6]) : null,
              power: item[7]?.length > 0 ? parseFloat(item[7]) : null,
              range: item[8] || "",
              dispersion: item[9] || "",
              specialty: item[10],
              height: item[11].length > 0 ? parseFloat(item[11]) : null,
              width: item[12].length > 0 ? parseFloat(item[12]) : null,
              depth: item[13].length > 0 ? parseFloat(item[13]) : null,
              url: item[14],
              image_url: item[15]
            };
          }

          items.push(row);
        });

        // Update cached items and count
        this.cachedItems[tab] = items;
        this.tabCounts[tab] = items.length;

        return items;
      } catch (error) {
        console.error(`Error loading data for tab ${tab}:`, error);
        this.cachedItems[tab] = [];
        this.tabCounts[tab] = 0;
        return [];
      }
    },

    async loadData(tab) {
      // If we have cached data, use it
      if (this.cachedItems[tab].length > 0) {
        this.items = [...this.cachedItems[tab]];
        this.applyFilters();
      } else {
        // Otherwise, load it
        this.items = [];
        await this.loadTabData(tab);
        this.items = [...this.cachedItems[tab]];
        this.applyFilters();
      }
    },

    switchTab(tab) {
      if (this.activeTab !== tab) {
        this.activeTab = tab;
        this.updateUrlWithTab(tab); // Update URL with the new tab
        this.loadData(this.activeTab);
      }
    },

    calculateVolume(item) {
      if (!item.height || !item.width || !item.depth) {
        return null;
      }
      const volumeInLiters = (item.height * item.width * item.depth) / 1000000;
      return volumeInLiters.toFixed(0);
    },

    formatPrice(price) {
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(price);
    },

    applyFilters() {
      this.displayedItems = this.items.filter((item) => {
        if (!item) return false;

        const popularMatch = (!this.filters.popular) || (this.filters.popular === item.popular);
        const nameMatch = (item.name || "")
          .toLowerCase()
          .includes((this.filters.name || "").toLowerCase());
        const developerMatch = (item.developer || "")
          .toLowerCase()
          .includes((this.filters.developer || "").toLowerCase());
        const enclosureMatch =
          this.filters.enclosures.length === 0 ||
          this.filters.enclosures.includes(item.enclosure);
        const typeMatch =
          this.filters.types.length === 0 ||
          this.filters.types.includes(item.type);
        const specialtyMatch =
          this.filters.specialties.length === 0 ||
          this.filters.specialties.includes(item.specialty);

        const priceMatch =
          !this.filters.price || item.price <= this.filters.price;
        const heightMatch =
          !this.filters.height || item.height <= this.filters.height;
        const widthMatch =
          !this.filters.width || item.width <= this.filters.width;
        const depthMatch =
          !this.filters.depth || item.depth <= this.filters.depth;

        const volumeInLiters =
          (item.height * item.width * item.depth) / 1000000;
        const volumeMatch =
          !this.filters.volume || volumeInLiters <= this.filters.volume;

        const f3Match = !this.filters.f3 || item.f3 <= this.filters.f3;
        const sensitivityMatch = !this.filters.sensitivity ||
          (item.sensitivity && item.sensitivity >= this.filters.sensitivity);

        // PA-specific filters
        const powerMatch = !this.filters.power ||
          (item.power && item.power >= this.filters.power);
        const rangeMatch = !this.filters.range ||
          (item.range && item.range.toLowerCase().includes(this.filters.range.toLowerCase()));
        const dispersionMatch = !this.filters.dispersion ||
          (item.dispersion && item.dispersion.toLowerCase().includes(this.filters.dispersion.toLowerCase()));

        return (
          popularMatch &&
          nameMatch &&
          priceMatch &&
          enclosureMatch &&
          typeMatch &&
          specialtyMatch &&
          heightMatch &&
          widthMatch &&
          depthMatch &&
          volumeMatch &&
          developerMatch &&
          f3Match &&
          sensitivityMatch &&
          powerMatch &&
          rangeMatch &&
          dispersionMatch
        );
      });
    },

    addFilter(filterType, value) {
      if (!value) return;
      if (!this.filters[filterType].includes(value)) {
        this.filters[filterType].push(value);
        this.applyFilters();
      }
      // Reset the select more explicitly
      if (filterType === "specialties") {
        this.selectedSpecialty = "";
      } else if (filterType === "types") {
        this.selectedType = "";
      } else if (filterType === "enclosures") {
        this.selectedEnclosure = "";
      }
    },

    removeFilter(filterType, value) {
      const index = this.filters[filterType].indexOf(value);
      if (index > -1) {
        this.filters[filterType].splice(index, 1);
        this.applyFilters();
      }
    },

    clearFilter(filterName) {
      if (["enclosures", "types", "specialties"].includes(filterName)) {
        this.filters[filterName] = [];
        this[
          `selected${filterName.slice(0, -1).charAt(0).toUpperCase() +
          filterName.slice(1, -1)
          }`
        ] = "";
      } else if (
        ["price", "height", "width", "depth", "volume", "f3", "sensitivity", "power"].includes(
          filterName
        )
      ) {
        this.filters[filterName] = null;
      } else {
        this.filters[filterName] = "";
      }
      this.applyFilters();
    },

    createNewEntry() {
      this.isNewEntry = true;
      this.editingItem = {
        name: "",
        developer: "",
        price: null,
        enclosure: "",
        type: "",
        f3: null,
        specialty: "",
        height: null,
        width: null,
        depth: null,
        url: "",
        image_url: "",
        sensitivity: null,
        power: null,
        range: "",
        dispersion: "",
        tabType: "",
        changes: {},
      };
      this.showEditDialog = true;
    },

    editItem(item) {
      this.isNewEntry = false;
      this.editingItem = {
        ...item,
        tabType: this.activeTab, // Store the tab type for edited entries
        changes: {},
      };
      this.showEditDialog = true;
    },

    resetEditDialog() {
      this.showEditDialog = false;
      this.editingItem = {};
    },

    addItemToComparison(item) {
      if (!this.compareItems.includes(item)) {
        this.compareItems.push(item);
      }
    },

    startCompareItems(itemsToCompare) {
      this.displayedItems = itemsToCompare;
    },

    endCompareItems() {
      this.applyFilters();
    },

    handleKeydown(event) {
      if (event.key === "Escape") {
        if (this.showDimensionsDialog) {
          this.showDimensionsDialog = false;
        }
      }
    },
    createAnchor(name) {
      return '#speaker-' + encodeURIComponent(name?.replace(/\s+/g, '-').toLowerCase() || index);
    },
    copyAnchorToClipboard(name) {
      const anchor = this.createAnchor(name);
      navigator.clipboard.writeText(new URL(anchor, window.location.href).toString());
      this.copiedMessage = 'Link copied to clipboard!';
      this.copiedSpeaker = name;
      setTimeout(() => {
        this.copiedMessage = '';
      }, 1000);
    },
    openDimensionsDialog() {
      this.showDimensionsDialog = true;
    },

    applyDimensionsFilters() {
      this.applyFilters();
      this.showDimensionsDialog = false;
    },
    scrollToTargetElement(targetElement, attemptCount = 0, maxAttempts = 5) {
      if (targetElement) {
        // Check if all images in the table are loaded
        const images = document.querySelectorAll('table img');
        const allImagesLoaded = Array.from(images).every(img => img.complete);

        if (allImagesLoaded) {
          // All images loaded, safe to scroll
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

          // pulse
          const tr = targetElement.closest('tr');
          if (tr) {
            tr.classList.add('bg-green-100');
            setTimeout(() => {
              tr.classList.remove('bg-green-100');
            }, 1000);
          }

        } else if (attemptCount < maxAttempts) {
          // Some images still loading, wait for them
          const nextAttemptDelay = Math.min(100 * Math.pow(2, attemptCount), 2000); // Exponential backoff with max 2s
          setTimeout(() => {
            this.scrollToTargetElement(attemptCount + 1, maxAttempts);
          }, nextAttemptDelay);
        } else {
          // Max attempts reached, scroll anyway
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    },
  },
  mounted() {
    this.loadAllData().then(() => {
      if (window.location.hash) {
        this.$nextTick(() => {
          // Add a small delay to ensure everything is rendered
          setTimeout(() => {
            const targetElement = document.getElementById(window.location.hash.substring(1));
            if (targetElement) {
              this.scrollToTargetElement(targetElement);
            }
          }, 100);
        });
      }
    });

    window.addEventListener("keydown", this.handleKeydown);

    // Listen for popstate events (browser back/forward buttons)
    window.addEventListener('popstate', () => {
      const newTab = this.getInitialTab();
      if (this.activeTab !== newTab) {
        this.activeTab = newTab;
        this.loadData(this.activeTab);
      }
    });
  },
  unmounted() {
    window.removeEventListener("keydown", this.handleKeydown);
  },
};
</script>

<template>
  <!-- SVG Sprites - defined once -->
  <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
    <symbol id="edit-icon" viewBox="0 0 20 20">
      <path
        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </symbol>

    <symbol id="anchor-icon" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </symbol>

    <symbol id="compare-icon" viewBox="0 0 1024 896">
      <path
        d="M832 721.75V320c0-192.5-192-192-192-192h-64V0L384 192l192 192V256c0 0 26.688 0 64 0 56.438 0 64 64 64 64v401.75c-38.125 22.188-64 62.875-64 110.25 0 70.625 57.375 128 128 128s128-57.375 128-128C896 784.75 870.125 743.938 832 721.75zM768 896c-35.312 0-64-28.625-64-64 0-35.312 28.688-64 64-64 35.375 0 64 28.688 64 64C832 867.375 803.375 896 768 896zM64 315.59400000000005v401.719c0 192.5 192 192 192 192h64v128l192-192-192-192v128c0 0-26.688 0-64 0-56.438 0-64-64-64-64V315.59400000000005c38.156-22.219 64-62.906 64-110.281 0-70.656-57.344-128-128-128s-128 57.344-128 128C0 252.59400000000005 25.844 293.375 64 315.59400000000005zM128 272c-35.312 0-64-28.594-64-64 0-35.312 28.688-64 64-64 35.406 0 64 28.688 64 64C192 243.40599999999995 163.406 272 128 272z" />
    </symbol>

    <symbol id="trash-icon" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" fill="white" />
      <path d="M5 7.5H19L18 21H6L5 7.5Z" stroke="#000000" stroke-linejoin="round" />
      <path d="M15.5 9.5L15 19" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M12 9.5V19" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M8.5 9.5L9 19" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M16 5H19C20.1046 5 21 5.89543 21 7V7.5H3V7C3 5.89543 3.89543 5 5 5H8M16 5L15 3H9L8 5M16 5H8"
        stroke="#000000" stroke-linejoin="round" />
    </symbol>

    <symbol id="star-icon" viewBox="0 0 256 256" xml:space="preserve">
      <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;"
        transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
        <path
          d="M 47.755 3.765 l 11.525 23.353 c 0.448 0.907 1.313 1.535 2.314 1.681 l 25.772 3.745 c 2.52 0.366 3.527 3.463 1.703 5.241 L 70.42 55.962 c -0.724 0.706 -1.055 1.723 -0.884 2.72 l 4.402 25.667 c 0.431 2.51 -2.204 4.424 -4.458 3.239 L 46.43 75.47 c -0.895 -0.471 -1.965 -0.471 -2.86 0 L 20.519 87.588 c -2.254 1.185 -4.889 -0.729 -4.458 -3.239 l 4.402 -25.667 c 0.171 -0.997 -0.16 -2.014 -0.884 -2.72 L 0.931 37.784 c -1.824 -1.778 -0.817 -4.875 1.703 -5.241 l 25.772 -3.745 c 1.001 -0.145 1.866 -0.774 2.314 -1.681 L 42.245 3.765 C 43.372 1.481 46.628 1.481 47.755 3.765 z"
          style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,213,0); fill-rule: nonzero; opacity: 1;"
          transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
      </g>
    </symbol>

  </svg>

  <div class="overflow-scroll h-screen">
    <!-- Header -->
    <div class="left-0 text-md tracking-wide font-semibold w-full text-green-700 mt-4 mb-8">
      <div class="flex items-center justify-between rounded-md mx-4 p-2" style="background-color: var(--color-gray-50)">
        <div class="flex items-center">
          <a href="/">
            <span class="uppercase tracking-wide px-2 whitespace-nowrap">DIY Speaker DB</span>
          </a>
        </div>
        <button @click="createNewEntry"
          class="px-3 py-2 font-medium bg-white text-sm text-green-700 rounded-md shadow-md cursor-pointer hover:bg-gray-100 hover:text-gray-900">
          Submit New Entry
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex ml-6 space-x-1">
      <button @click="switchTab('hifi')" class="px-4 py-1 rounded-t-md transition-colors"
        :class="activeTab === 'hifi' ? 'bg-gray-50 text-green-700 font-medium shadow-sm' : 'text-gray-600 hover:text-green-600'">
        HiFi
        <span class="ml-1 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
          {{ tabCounts.hifi }}
        </span>
      </button>
      <button @click="switchTab('hifi-commercial')" class="px-4 py-1 rounded-t-md transition-colors"
        :class="activeTab === 'hifi-commercial' ? 'bg-gray-50 text-green-700 font-medium shadow-sm' : 'text-gray-600 hover:text-green-600'">
        HiFi Commercial
        <span class="ml-1 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
          {{ tabCounts['hifi-commercial'] }}
        </span>
      </button>
      <button @click="switchTab('pa')" class="px-4 py-1 rounded-t-md transition-colors"
        :class="activeTab === 'pa' ? 'bg-gray-50 text-green-700 font-medium shadow-sm' : 'text-gray-600 hover:text-green-600'">
        PA
        <span class="ml-1 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
          {{ tabCounts.pa }}
        </span>
      </button>
      <button @click="switchTab('pa-commercial')" class="px-4 py-1 rounded-t-md transition-colors"
        :class="activeTab === 'pa-commercial' ? 'bg-gray-50 text-green-700 font-medium shadow-sm' : 'text-gray-600 hover:text-green-600'">
        PA Commercial
        <span class="ml-1 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
          {{ tabCounts['pa-commercial'] }}
        </span>
      </button>
    </div>
    <!-- Main Content -->
    <div class="container min-w-full mx-auto">
      <!-- Table -->
      <div class=" min-w-full w-fit rounded-lg px-1">
        <table class="min-w-full table-fixed divide-y divide-gray-200">
          <thead class="sticky top-0 text-green-700 bg-gray-50">
            <!-- Header Row -->
            <tr class="text-sm uppercase">
              <th v-for="(column, index) in columnConfigs[activeTab]" :key="column.key" scope="col"
                :class="column.width + ' px-1 py-3 whitespace-nowrap'">
                {{ column.label }}
              </th>
              <th scope="col" class="w-[20pt] px-2 py-3"></th>
            </tr>

            <!-- Filter Row -->
            <tr class="align-baseline text-sm">
              <th v-for="(column, index) in columnConfigs[activeTab]" :key="column.key" class="px-3 py-3">

                <!-- Popular filter -->
                <div v-if="column.key === 'image'" class="text-nowrap">
                  <label class="relative group">
                    <input type="checkbox" v-model="filters.popular" @change="applyFilters"
                      class="rounded-md bg-white border-green-300 font-normal text-gray-900 mx-2"
                      placeholder="Popular" />
                    <span class="relative cursor-help text-green-700 ml-0.5">
                      ?
                      <div class="absolute left-0 bottom-full mb-2 w-100 text-wrap font-normal p-2 bg-white text-gray-600 text-left 
                      text-xs rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity 
                      z-10 pointer-events-none border border-green-200">
                        Popularity is determined by measured interest in a speaker, eg 
                        numbers of comments or forum posts for a given speaker design.
                        <p/>
                        <br><b>Important:</b> Popularity is NOT comparable across speaker developers and NOT a global ranking!
                        It is only somewhat valid per developer and only reflects popularity, not necessarily quality.<br>
                        Available data is spotty and incomplete.
                      </div>
                    </span>
                  </label>
                </div>

                <!-- Name filter -->
                <input v-else-if="column.key === 'name'" type="text" v-model="filters.name" @input="applyFilters"
                  @keyup.esc="clearFilter('name')"
                  class="w-full font-normal rounded-md px-2 py-1 bg-white border-green-300 text-gray-900"
                  placeholder="Filter by name" />

                <!-- Developer filter -->
                <input v-else-if="column.key === 'developer'" type="text" v-model="filters.developer"
                  @input="applyFilters" @keyup.esc="clearFilter('developer')"
                  class="w-full font-normal rounded-md px-2 py-1 bg-white border-green-300 text-gray-900 focus:border-green-500"
                  placeholder="Filter by developer" />

                <!-- Price filter -->
                <input v-else-if="column.key === 'price'" type="number" v-model.number="filters.price"
                  @input="applyFilters" @keyup.esc="clearFilter('price')"
                  class="w-full font-normal rounded-md px-2 py-1 text-gray-900 bg-white border-green-300 focus:border-green-500"
                  placeholder="< €" />

                <!-- Enclosure filter -->
                <div v-else-if="column.key === 'enclosure'" class="relative">
                  <select v-model="selectedEnclosure" @change="addFilter('enclosures', selectedEnclosure)"
                    class="w-full font-normal text-gray-500 rounded-md mt-1 px-2 py-1 bg-white border-green-300 focus:border-green-500">
                    <option class="" value="">Select...</option>
                    <option v-for="enclosure in availableEnclosures" :key="enclosure" :value="enclosure">
                      {{ enclosure }}
                    </option>
                  </select>
                  <div class="mt-2 flex flex-wrap gap-2 font-normal">
                    <span v-for="item in filters.enclosures" :key="item"
                      class="inline-flex items-center pl-2 py-1 rounded-md text-xs bg-green-300 text-gray-900">
                      {{ item }}
                      <button @click="removeFilter('enclosures', item)"
                        class="ml-1 mr-2 font-normal text-gray-500 hover:cursor-pointer hover:text-red-700">
                        ×
                      </button>
                    </span>
                  </div>
                </div>

                <!-- Type filter -->
                <div v-else-if="column.key === 'type'" class="relative">
                  <select v-model="selectedType" @change="addFilter('types', selectedType)"
                    class="w-full font-normal text-gray-500 rounded-md mt-1 px-2 py-1 bg-white border-green-300 focus:border-green-500">
                    <option value="">Select...</option>
                    <option v-for="type in availableTypesHifi" v-if="this.activeTab.startsWith('hifi')" :key="type"
                      :value="type">
                      {{ type }}
                    </option>
                    <option v-for="type in availableTypesPa" v-if="this.activeTab.startsWith('pa')" :key="type"
                      :value="type">
                      {{ type }}
                    </option>
                  </select>
                  <div class="mt-2 flex flex-wrap gap-2 font-normal">
                    <span v-for="item in filters.types" :key="item"
                      class="inline-flex items-center pl-2 py-1 rounded-md text-xs bg-green-300 text-gray-900">
                      {{ item }}
                      <button @click="removeFilter('types', item)"
                        class="ml-1 mr-2 font-normal text-gray-500 hover:cursor-pointer hover:text-red-700">
                        ×
                      </button>
                    </span>
                  </div>
                </div>

                <!-- F3 filter -->
                <input v-else-if="column.key === 'f3'" type="number" v-model.number="filters.f3" @input="applyFilters"
                  @keyup.esc="clearFilter('f3')"
                  class="w-full font-normal text-gray-900 rounded-md px-2 py-1 bg-white border-green-300 focus:border-green-500"
                  placeholder="< Hz" />

                <!-- Sensitivity filter -->
                <input v-else-if="column.key === 'sensitivity'" type="number" name="filter-sensitivity"
                  v-model.number="filters.sensitivity" @input="applyFilters" @keyup.esc="clearFilter('sensitivity')"
                  class="w-full font-normal text-gray-900 rounded-md px-2 py-1 bg-white border-green-300 focus:border-green-500"
                  placeholder="> dB" />

                <!-- Power filter (PA only) -->
                <input v-else-if="column.key === 'power'" type="number" v-model.number="filters.power"
                  @input="applyFilters" @keyup.esc="clearFilter('power')"
                  class="w-full font-normal text-gray-900 rounded-md px-2 py-1 bg-white border-green-300 focus:border-green-500"
                  placeholder="> W" />

                <!-- Range filter (PA only) -->
                <input v-else-if="column.key === 'range'" type="text" v-model="filters.range" @input="applyFilters"
                  @keyup.esc="clearFilter('range')"
                  class="w-full font-normal text-gray-900 rounded-md px-2 py-1 bg-white border-green-300 focus:border-green-500"
                  placeholder="Filter range" />

                <!-- Dispersion filter (PA only) -->
                <input v-else-if="column.key === 'dispersion'" type="text" v-model="filters.dispersion"
                  @input="applyFilters" @keyup.esc="clearFilter('dispersion')"
                  class="w-full font-normal text-gray-900 rounded-md px-2 py-1 bg-white border-green-300 focus:border-green-500"
                  placeholder="Filter dispersion" />

                <!-- Specialty filter -->
                <div v-else-if="column.key === 'specialty'" class="relative">
                  <select v-model="selectedSpecialty" @change="addFilter('specialties', selectedSpecialty)"
                    class="w-full font-normal text-gray-500 rounded-md mt-1 px-2 py-1 bg-white border-green-300 focus:border-green-500">
                    <option value="">Select...</option>
                    <option v-for="specialty in availableSpecialties" :key="specialty" :value="specialty">
                      {{ specialty }}
                    </option>
                  </select>
                  <div class="mt-2 flex flex-wrap gap-2 font-normal">
                    <span v-for="item in filters.specialties" :key="item"
                      class="inline-flex items-center pl-2 py-1 rounded-md text-xs bg-green-300 text-gray-900">
                      {{ item }}
                      <button @click="removeFilter('specialties', item)"
                        class="ml-1 mr-2 font-normal text-gray-500 hover:cursor-pointer hover:text-red-700">
                        ×
                      </button>
                    </span>
                  </div>
                </div>

                <!-- Dimensions filter -->
                <div v-else-if="column.key === 'dimensions'" class="relative">
                  <button @click="openDimensionsDialog"
                    class="w-full font-normal text-sm text-gray-500 rounded-md mt-1 px-2 py-1 bg-white border border-green-300 hover:bg-gray-50">
                    Filter...
                  </button>

                  <!-- Show filter indicators if any dimension filter is applied -->
                  <div v-if="filters.height || filters.width || filters.depth"
                    class="mt-2 flex flex-wrap gap-2 font-normal">
                    <span v-if="filters.height"
                      class="inline-flex items-center pl-2 py-1 rounded-md text-xs bg-green-300 text-gray-900">
                      H: {{ filters.height }}
                      <button @click="clearFilter('height')"
                        class="ml-1 mr-2 font-normal text-gray-500 hover:cursor-pointer hover:text-red-700">
                        ×
                      </button>
                    </span>
                    <span v-if="filters.width"
                      class="inline-flex items-center pl-2 py-1 rounded-md text-xs bg-green-300 text-gray-900">
                      W: {{ filters.width }}
                      <button @click="clearFilter('width')"
                        class="ml-1 mr-2 font-normal text-gray-500 hover:cursor-pointer hover:text-red-700">
                        ×
                      </button>
                    </span>
                    <span v-if="filters.depth"
                      class="inline-flex items-center pl-2 py-1 rounded-md text-xs bg-green-300 text-gray-900">
                      D: {{ filters.depth }}
                      <button @click="clearFilter('depth')"
                        class="ml-1 mr-2 font-normal text-gray-500 hover:cursor-pointer hover:text-red-700">
                        ×
                      </button>
                    </span>
                  </div>
                </div>

                <!-- Volume filter -->
                <input v-else-if="column.key === 'volume'" type="number" v-model.number="filters.volume"
                  @input="applyFilters" @keyup.esc="clearFilter('volume')"
                  class="w-full font-normal rounded-md px-2 py-1 bg-white text-gray-900 border-green-300 focus:border-green-500"
                  placeholder="< L" />
              </th>
              <th class="px-3 py-3"></th>
            </tr>
          </thead>

          <tbody class="table-row-group w-full bg-white divide-y divide-gray-200">
            <tr class="hover:bg-gray-50 text-sm font-normal text-gray-800 transition-colors duration-1000"
              v-for="(item, index) in displayedItems" :key="index"
              :id="'speaker-' + encodeURIComponent(item.name?.replace(/\s+/g, '-').toLowerCase() || index)">
              <td class="px-2 py-4">
                <a v-if="item.image_url" :href="item.url" target="_blank" class="">
                  <div class="overflow-hidden rounded-sm">
                    <img v-if="item.image_url" :src="proxyImage(item.image_url)" :alt="item.name"
                      class="hover:scale-105 max-h-[120px]" />
                  </div>
                </a>
              </td>
              <td class="px-2 py-4">
                <div class="flex items-start gap-2">
                  <div class="min-w-0">
                    <a :href="item.url" target="_blank"
                      class="text-green-900 underline text-sm font-normal text-gray-800 hover:text-green-700">
                      {{ item.name }}
                    </a>
                  </div>

                  <div class="inline-block relative shrink-0">
                    <a :href="createAnchor(item.name)" class="text-gray-400 hover:text-green-700 cursor-pointer"
                      title="Copy link to this speaker" @click.prevent="copyAnchorToClipboard(item.name)">
                      <svg class="h-4 w-4 inline" fill="none">
                        <use xlink:href="#anchor-icon" />
                      </svg>
                    </a>

                    <transition leave-active-class="transition duration-500" leave-to-class="opacity-0">
                      <div v-if="copiedMessage && copiedSpeaker === item.name"
                        class="absolute left-full top-0 ml-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                        {{ copiedMessage }}
                      </div>
                    </transition>
                  </div>

                  <svg v-if="item.popular" class="h-4 w-4 inline" fill="currentColor">
                    <use xlink:href="#star-icon" />
                  </svg>

                </div>
              </td>
              <td class="px-2 py-4">
                {{ item.developer }}
              </td>
              <td class="px-2 py-4 text-right">
                <span v-if="item.price">{{ formatPrice(item.price) }}</span>
                <span v-if="!item.price" class="text-gray-400">N/A</span>
              </td>
              <td class="px-2 py-4">
                {{ item.enclosure }}
              </td>
              <td class="px-2 py-4 whitespace-wrap">
                {{ item.type }}
              </td>
              <td class="px-2 py-4 text-right whitespace-nowrap">
                <span v-if="item.f3">{{ item.f3 }} Hz</span>
              </td>
              <td class="px-2 py-4 text-right">
                <span v-if="item.sensitivity">{{ item.sensitivity }} dB</span>
                <span v-if="!item.sensitivity" class="text-gray-400">N/A</span>
              </td>
              <td v-if="activeTab.startsWith('pa')" class="px-2 py-4 text-right">
                <span v-if="item.power">{{ item.power }} W</span>
                <span v-if="!item.power" class="text-gray-400">N/A</span>
              </td>
              <td v-if="activeTab.startsWith('pa')" class="px-2 py-4 text-right">
                {{ item.range }}
              </td>
              <td v-if="activeTab.startsWith('pa')" class="px-2 py-4 text-right">
                {{ item.dispersion }}
              </td>
              <td class="px-2 py-4">
                {{ item.specialty }}
              </td>
              <td class="px-2 py-4 text-left">
                <span v-if="item.height && item.width && item.depth">
                  {{ item.height }} x<br>
                  {{ item.width }} x<br>
                  {{ item.depth }}
                </span>
                <span v-if="!item.height" class="text-gray-400">N/A</span>
              </td>
              <td class="px-2 py-4 text-right">
                <span v-if="calculateVolume(item)">{{ calculateVolume(item) }} L</span>
                <span v-if="!calculateVolume(item)" class="text-gray-400">N/A</span>
              </td>
              <td class="px-2 py-4 text-center">
                <button @click="editItem(item)"
                  class="p-1 text-gray-600 rounded-md cursor-pointer hover:bg-gray-100 hover:text-green-700"
                  title="Edit">
                  <svg class="h-4 w-4" fill="currentColor">
                    <use xlink:href="#edit-icon" />
                  </svg>
                </button>
                <button @click="addItemToComparison(item)"
                  class="p-1 text-gray-600 rounded-md cursor-pointer hover:bg-gray-100 hover:text-green-700"
                  title="Compare">
                  <svg class="h-4 w-4" fill="currentColor">
                    <use xlink:href="#compare-icon" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Dimensions Filter Dialog -->
      <div v-if="showDimensionsDialog"
        class="fixed inset-0 flex items-center justify-center p-4 bg-gray-50 bg-opacity-75 z-10">
        <div class="bg-white text-green-900 rounded-md shadow-lg max-w-md w-full p-6">
          <h2 class="text-lg font-bold uppercase mb-4">Filter Dimensions</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-green-800 mb-2">
                Height (mm)
              </label>
              <input type="number" v-model.number="filters.height"
                class="w-full font-normal rounded-md px-3 py-2 border border-green-300 focus:border-green-500 focus:outline-none"
                placeholder="Maximum height" />
            </div>

            <div>
              <label class="block text-sm font-medium text-green-800 mb-2">
                Width (mm)
              </label>
              <input type="number" v-model.number="filters.width"
                class="w-full font-normal rounded-md px-3 py-2 border border-green-300 focus:border-green-500 focus:outline-none"
                placeholder="Maximum width" />
            </div>

            <div>
              <label class="block text-sm font-medium text-green-800 mb-2">
                Depth (mm)
              </label>
              <input type="number" v-model.number="filters.depth"
                class="w-full font-normal rounded-md px-3 py-2 border border-green-300 focus:border-green-500 focus:outline-none"
                placeholder="Maximum depth" />
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button @click="showDimensionsDialog = false"
              class="px-4 py-2 cursor-pointer bg-gray-200 border-gray-500 rounded-md text-gray-500 shadow-sm hover:bg-gray-100">
              Cancel
            </button>
            <button @click="applyDimensionsFilters"
              class="px-4 py-2 text-sm font-medium text-green-900 bg-green-200 border-gray-500 rounded-md shadow-md cursor-pointer hover:bg-gray-100">
              Apply
            </button>
          </div>
        </div>
      </div>

      <!-- Edit Dialog Component -->
      <edit-item-dialog :prop-show-dialog="showEditDialog" :prop-editing-item="editingItem" :is-new-entry="isNewEntry"
        :available-enclosures="availableEnclosures" :available-types-hifi="availableTypesHifi"
        :available-types-pa="availableTypesPa" :available-specialties="availableSpecialties"
        @reset-edit-dialog="resetEditDialog" />

      <compare-widget :items="compareItems" @start-compare-items="startCompareItems"
        @end-compare-items="endCompareItems" />
    </div>
  </div>
</template>
