  <script>
import { proxyImage } from './utils/imageProxy';
import EditItemDialog from './components/EditItemDialog.vue';

export default {
  name: "App",
  components: {
    EditItemDialog
  },
  data() {
    return {
      items: [],
      displayedItems: [],
      showDialog: false,
      newEntry: {
        name: "",
      },
      proxyImage,
      activeTab: 'hifi', // Default to HiFi tab
      dataSources: {
        hifi: "https://sheets.googleapis.com/v4/spreadsheets/1PoYey8POjJOA-ucpMtjJpdDWmXww5tK5HlhHbNeUZrs/values/hifi-live?alt=json&key=AIzaSyCi5Azx-KvH8rfE3oTlRERkchMcSH-9dvA",
        'hifi-commercial': "https://sheets.googleapis.com/v4/spreadsheets/1PoYey8POjJOA-ucpMtjJpdDWmXww5tK5HlhHbNeUZrs/values/hifi-commercial-live?alt=json&key=AIzaSyCi5Azx-KvH8rfE3oTlRERkchMcSH-9dvA",
        pa: "https://sheets.googleapis.com/v4/spreadsheets/1PoYey8POjJOA-ucpMtjJpdDWmXww5tK5HlhHbNeUZrs/values/pa-live?alt=json&key=AIzaSyCi5Azx-KvH8rfE3oTlRERkchMcSH-9dvA",
        'pa-commercial': "https://sheets.googleapis.com/v4/spreadsheets/1PoYey8POjJOA-ucpMtjJpdDWmXww5tK5HlhHbNeUZrs/values/pa-commercial-live?alt=json&key=AIzaSyCi5Azx-KvH8rfE3oTlRERkchMcSH-9dvA"
      },
      columnConfigs: {
        hifi: [
          { key: 'image', label: '', width: 'min-w-[70pt] w-[70pt]' },
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
          { key: 'image', label: '', width: 'min-w-[70pt] w-[70pt]' },
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
          { key: 'image', label: '', width: 'min-w-[70pt] w-[70pt]' },
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
          { key: 'image', label: '', width: 'min-w-[70pt] w-[70pt]' },
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
      isSubmitting: false,
      originalItem: null,
      isNewEntry: false,
      formErrors: {
        name: false,
        url: false,
        enclosure: false,
        type: false,
        tabType: false,
      },
      selectedEnclosure: "",
      selectedType: "",
      selectedSpecialty: "",
      cachedItems: {
        hifi: [],
        'hifi-commercial': [],
        pa: [],
        'pa-commercial': []
      },
      tabCounts: {
        hifi: 0,
        'hifi-commercial': 0,
        pa: 0,
        'pa-commercial': 0
      }
    };
  },
  methods: {
    async loadAllData() {
      try {
        // Load data for all tabs
        const tabs = Object.keys(this.dataSources);
        
        for (const tab of tabs) {
          if (this.cachedItems[tab].length === 0) {
            await this.loadTabData(tab);
          }
        }
        
        // Set items based on active tab
        this.items = [...this.cachedItems[this.activeTab]];
        this.applyFilters();
      } catch (error) {
        alert("Error loading data: " + error.message);
      }
    },
    
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
              image_url: item[12]
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
              dispersion: item[8] || "",
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
    
    async loadData() {
      // If we have cached data, use it
      if (this.cachedItems[this.activeTab].length > 0) {
        this.items = [...this.cachedItems[this.activeTab]];
        this.applyFilters();
      } else {
        // Otherwise, load it
        this.items = [];
        await this.loadTabData(this.activeTab);
        this.items = [...this.cachedItems[this.activeTab]];
        this.applyFilters();
      }
    },
    
    switchTab(tab) {
      if (this.activeTab !== tab) {
        this.activeTab = tab;
        this.loadData();
      }
    },

    calculateVolume(item) {
      if(!item.height || !item.width || !item.depth) {
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
          `selected${
            filterName.slice(0, -1).charAt(0).toUpperCase() +
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
        tabType: this.activeTab, // Store the tab type for new entries
        changes: {},
      };
      this.originalItem = { ...this.editingItem };
      this.showEditDialog = true;
    },

    editItem(item) {
      this.isNewEntry = false;
      this.editingItem = {
        ...item,
        tabType: this.activeTab, // Store the tab type for edited entries
        changes: {},
      };
      this.originalItem = { ...item };
      this.showEditDialog = true;
    },

    trackChange(field, value) {
      if (JSON.stringify(this.originalItem[field]) !== JSON.stringify(value)) {
        this.editingItem.changes[field] = {
          from: this.originalItem[field],
          to: value,
        };
      } else {
        delete this.editingItem.changes[field];
      }
      delete this.formErrors[field];
    },

    closeEditDialog() {
      if (!this.isSubmitting) {
        this.showEditDialog = false;
        this.editingItem = {};
        this.originalItem = null;
        this.isNewEntry = false;
        this.formErrors = {
          name: false,
          url: false,
          enclosure: false,
          type: false,
          tabType: false,
        };
      }
    },

    async submitEdit() {

      this.isSubmitting = true;
      try {
        const url =
          "https://script.google.com/macros/s/AKfycbyVq-XrpTHxH8Nhe_yyUJWKnGdphIAkE0699USXGlrMHNi8JN3-FyrKhAWcBUPmHf8b/exec";
        const _response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            ...this.editingItem,
            isNewEntry: this.isNewEntry,
            tabType: this.activeTab, // Include the active tab in the submission
            timestamp: new Date().toISOString(),
          }),
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors",
        });

        this.isSubmitting = false;
        this.closeEditDialog();
      } catch (error) {
        alert("Error saving data: " + error.toString());
      } finally {
        this.isSubmitting = false;
      }
    },

    handleKeydown(event) {
      if (event.key === "Escape") {
        if (this.showEditDialog) {
          this.closeEditDialog();
        }
        if (this.showDialog) {
          this.showDialog = false;
        }
        if (this.showDimensionsDialog) {
          this.showDimensionsDialog = false;
        }
      }
    },
    
    openDimensionsDialog() {
      this.showDimensionsDialog = true;
    },
    
    applyDimensionsFilters() {
      this.applyFilters();
      this.showDimensionsDialog = false;
    },
  },
  mounted() {
    this.loadAllData();
    window.addEventListener("keydown", this.handleKeydown);
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
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
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
        <button
          @click="createNewEntry"
          class="px-3 py-2 font-medium bg-white text-sm text-green-700 rounded-md shadow-md cursor-pointer hover:bg-gray-100 hover:text-gray-900"
        >
          Submit New Entry
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex ml-6 space-x-1">
      <button 
        @click="switchTab('hifi')" 
        class="px-4 py-1 rounded-t-md transition-colors"
        :class="activeTab === 'hifi' ? 'bg-gray-50 text-green-700 font-medium shadow-sm' : 'text-gray-600 hover:text-green-600'"
      >
        HiFi
        <span class="ml-1 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
          {{ tabCounts.hifi }}
        </span>
      </button>
      <button 
        @click="switchTab('hifi-commercial')" 
        class="px-4 py-1 rounded-t-md transition-colors"
        :class="activeTab === 'hifi-commercial' ? 'bg-gray-50 text-green-700 font-medium shadow-sm' : 'text-gray-600 hover:text-green-600'"
      >
        HiFi Commercial
        <span class="ml-1 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
          {{ tabCounts['hifi-commercial'] }}
        </span>
      </button>
      <button 
        @click="switchTab('pa')" 
        class="px-4 py-1 rounded-t-md transition-colors"
        :class="activeTab === 'pa' ? 'bg-gray-50 text-green-700 font-medium shadow-sm' : 'text-gray-600 hover:text-green-600'"
      >
        PA
        <span class="ml-1 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
          {{ tabCounts.pa }}
        </span>
      </button>
      <button 
        @click="switchTab('pa-commercial')" 
        class="px-4 py-1 rounded-t-md transition-colors"
        :class="activeTab === 'pa-commercial' ? 'bg-gray-50 text-green-700 font-medium shadow-sm' : 'text-gray-600 hover:text-green-600'"
      >
        PA Commercial
        <span class="ml-1 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
          {{ tabCounts['pa-commercial'] }}
        </span>
      </button>
    </div>
    <!-- Main Content -->
    <div class="container min-w-full mx-auto">
      <!-- Table -->
      <div
        class=" min-w-full w-fit rounded-lg px-1"
      >
        <table class="min-w-full table-fixed divide-y divide-gray-200">
          <thead class="sticky top-0 text-green-700 bg-gray-50">
            <!-- Header Row -->
            <tr class="text-sm uppercase">
              <th
                v-for="(column, index) in columnConfigs[activeTab]"
                :key="column.key"
                scope="col"
                :class="column.width + ' px-1 py-3 whitespace-nowrap'"
              >
                {{ column.label }}
              </th>
              <th
                scope="col"
                class="w-[20pt] px-2 py-3"
              ></th>
            </tr>

            <!-- Filter Row -->
            <tr class="align-baseline text-sm">
              <!-- Image column has no filter -->
              <th v-for="(column, index) in columnConfigs[activeTab]" :key="column.key" class="px-3 py-3">
                <!-- Image column (no filter) -->
                <template v-if="column.key === 'image'"></template>
                
                <!-- Name filter -->
                <input v-else-if="column.key === 'name'"
                  type="text"
                  v-model="filters.name"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('name')"
                  class="w-full font-normal rounded-md px-2 py-1 bg-white border-green-300 text-gray-900"
                  placeholder="Filter by name"
                />
                
                <!-- Developer filter -->
                <input v-else-if="column.key === 'developer'"
                  type="text"
                  v-model="filters.developer"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('developer')"
                  class="w-full font-normal rounded-md px-2 py-1 bg-white border-green-300 text-gray-900 focus:border-green-500"
                  placeholder="Filter by developer"
                />
                
                <!-- Price filter -->
                <input v-else-if="column.key === 'price'"
                  type="number"
                  v-model.number="filters.price"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('price')"
                  class="w-full font-normal rounded-md px-2 py-1 text-gray-900 bg-white border-green-300 focus:border-green-500"
                  placeholder="< €"
                />
                
                <!-- Enclosure filter -->
                <div v-else-if="column.key === 'enclosure'" class="relative">
                  <select
                    v-model="selectedEnclosure"
                    @change="addFilter('enclosures', selectedEnclosure)"
                    class="w-full font-normal text-gray-500 rounded-md mt-1 px-2 py-1 bg-white border-green-300 focus:border-green-500"
                  >
                    <option class="" value="">Select...</option>
                    <option
                      v-for="enclosure in availableEnclosures"
                      :key="enclosure"
                      :value="enclosure"
                    >
                      {{ enclosure }}
                    </option>
                  </select>
                  <div class="mt-2 flex flex-wrap gap-2 font-normal">
                    <span
                      v-for="item in filters.enclosures"
                      :key="item"
                      class="inline-flex items-center pl-2 py-1 rounded-md text-xs bg-green-300 text-gray-900"
                    >
                      {{ item }}
                      <button
                        @click="removeFilter('enclosures', item)"
                        class="ml-1 mr-2 font-normal text-gray-500 hover:cursor-pointer hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                </div>
                
                <!-- Type filter -->
                <div v-else-if="column.key === 'type'" class="relative">
                  <select
                    v-model="selectedType"
                    @change="addFilter('types', selectedType)"
                    class="w-full font-normal text-gray-500 rounded-md mt-1 px-2 py-1 bg-white border-green-300 focus:border-green-500"
                  >
                    <option value="">Select...</option>
                    <option
                      v-for="type in availableTypesHifi"
                      v-if="this.activeTab.startsWith('hifi')"
                      :key="type"
                      :value="type"
                    >
                      {{ type }}
                    </option>
                    <option
                      v-for="type in availableTypesPa"
                      v-if="this.activeTab.startsWith('pa')"
                      :key="type"
                      :value="type"
                    >
                      {{ type }}
                    </option>
                  </select>
                  <div class="mt-2 flex flex-wrap gap-2 font-normal">
                    <span
                      v-for="item in filters.types"
                      :key="item"
                      class="inline-flex items-center pl-2 py-1 rounded-md text-xs bg-green-300 text-gray-900"
                    >
                      {{ item }}
                      <button
                        @click="removeFilter('types', item)"
                        class="ml-1 mr-2 font-normal text-gray-500 hover:cursor-pointer hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                </div>
                
                <!-- F3 filter -->
                <input v-else-if="column.key === 'f3'"
                  type="number"
                  v-model.number="filters.f3"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('f3')"
                  class="w-full font-normal text-gray-900 rounded-md px-2 py-1 bg-white border-green-300 focus:border-green-500"
                  placeholder="< Hz"
                />
                
                <!-- Sensitivity filter -->
                <input v-else-if="column.key === 'sensitivity'"
                  type="number"
                  name="filter-sensitivity"
                  v-model.number="filters.sensitivity"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('sensitivity')"
                  class="w-full font-normal text-gray-900 rounded-md px-2 py-1 bg-white border-green-300 focus:border-green-500"
                  placeholder="> dB"
                />
                
                <!-- Power filter (PA only) -->
                <input v-else-if="column.key === 'power'"
                  type="number"
                  v-model.number="filters.power"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('power')"
                  class="w-full font-normal text-gray-900 rounded-md px-2 py-1 bg-white border-green-300 focus:border-green-500"
                  placeholder="> W"
                />
                
                <!-- Range filter (PA only) -->
                <input v-else-if="column.key === 'range'"
                  type="text"
                  v-model="filters.range"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('range')"
                  class="w-full font-normal text-gray-900 rounded-md px-2 py-1 bg-white border-green-300 focus:border-green-500"
                  placeholder="Filter range"
                />
                
                <!-- Dispersion filter (PA only) -->
                <input v-else-if="column.key === 'dispersion'"
                  type="text"
                  v-model="filters.dispersion"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('dispersion')"
                  class="w-full font-normal text-gray-900 rounded-md px-2 py-1 bg-white border-green-300 focus:border-green-500"
                  placeholder="Filter dispersion"
                />
                
                <!-- Specialty filter -->
                <div v-else-if="column.key === 'specialty'" class="relative">
                  <select
                    v-model="selectedSpecialty"
                    @change="addFilter('specialties', selectedSpecialty)"
                    class="w-full font-normal text-gray-500 rounded-md mt-1 px-2 py-1 bg-white border-green-300 focus:border-green-500"
                  >
                    <option value="">Select...</option>
                    <option
                      v-for="specialty in availableSpecialties"
                      :key="specialty"
                      :value="specialty"
                    >
                      {{ specialty }}
                    </option>
                  </select>
                  <div class="mt-2 flex flex-wrap gap-2 font-normal">
                    <span
                      v-for="item in filters.specialties"
                      :key="item"
                      class="inline-flex items-center pl-2 py-1 rounded-md text-xs bg-green-300 text-gray-900"
                    >
                      {{ item }}
                      <button
                        @click="removeFilter('specialties', item)"
                        class="ml-1 mr-2 font-normal text-gray-500 hover:cursor-pointer hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                </div>
                
                <!-- Dimensions filter -->
                <div v-else-if="column.key === 'dimensions'" class="relative">
                  <button
                    @click="openDimensionsDialog"
                    class="w-full font-normal text-sm text-gray-500 rounded-md mt-1 px-2 py-1 bg-white border border-green-300 hover:bg-gray-50"
                  >
                    Filter...
                  </button>
                  
                  <!-- Show filter indicators if any dimension filter is applied -->
                  <div v-if="filters.height || filters.width || filters.depth" class="mt-2 flex flex-wrap gap-2 font-normal">
                    <span
                      v-if="filters.height"
                      class="inline-flex items-center pl-2 py-1 rounded-md text-xs bg-green-300 text-gray-900"
                    >
                      H: {{ filters.height }}
                      <button
                        @click="clearFilter('height')"
                        class="ml-1 mr-2 font-normal text-gray-500 hover:cursor-pointer hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                    <span
                      v-if="filters.width"
                      class="inline-flex items-center pl-2 py-1 rounded-md text-xs bg-green-300 text-gray-900"
                    >
                      W: {{ filters.width }}
                      <button
                        @click="clearFilter('width')"
                        class="ml-1 mr-2 font-normal text-gray-500 hover:cursor-pointer hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                    <span
                      v-if="filters.depth"
                      class="inline-flex items-center pl-2 py-1 rounded-md text-xs bg-green-300 text-gray-900"
                    >
                      D: {{ filters.depth }}
                      <button
                        @click="clearFilter('depth')"
                        class="ml-1 mr-2 font-normal text-gray-500 hover:cursor-pointer hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                </div>
                
                <!-- Volume filter -->
                <input v-else-if="column.key === 'volume'"
                  type="number"
                  v-model.number="filters.volume"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('volume')"
                  class="w-full font-normal rounded-md px-2 py-1 bg-white text-gray-900 border-green-300 focus:border-green-500"
                  placeholder="< L"
                />
              </th>
              <th class="px-3 py-3"></th>
            </tr>
          </thead>

          <tbody
            class="table-row-group w-full bg-white divide-y divide-gray-200"
          >
            <tr
              class="hover:bg-gray-50 text-sm font-normal text-gray-800"
              v-for="(item, index) in displayedItems"
              :key="index"
            >
              <td  class="px-2 py-4">
                <a
                  v-if="item.image_url"
                  :href="item.url"
                  target="_blank"
                  class=""
                >
                <div class="overflow-hidden rounded-sm">
                <img v-if="item.image_url"
                     :src="proxyImage(item.image_url)"
                     :alt="item.name"
                     class="hover:scale-105"/>
                     </div>
              </a>
              </td>
              <td class="px-2 py-4">
                <a
                  :href="item.url"
                  target="_blank"
                  class="text-green-900 underline text-sm font-normal text-gray-800 hover:text-green-700"
                >
                  {{ item.name }}
                </a>
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
                <button
                  @click="editItem(item)"
                  class="p-1 text-gray-600 rounded-md cursor-pointer hover:bg-gray-100 hover:text-green-700"
                  title="Edit"
                >
                  <svg class="h-4 w-4" fill="currentColor">
                    <use xlink:href="#edit-icon" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Dimensions Filter Dialog -->
      <div
        v-if="showDimensionsDialog"
        class="fixed inset-0 flex items-center justify-center p-4 bg-gray-50 bg-opacity-75 z-10"
      >
        <div class="bg-white text-green-900 rounded-md shadow-lg max-w-md w-full p-6">
          <h2 class="text-lg font-bold uppercase mb-4">Filter Dimensions</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-green-800 mb-2">
                Height (mm)
              </label>
              <input
                type="number"
                v-model.number="filters.height"
                class="w-full font-normal rounded-md px-3 py-2 border border-green-300 focus:border-green-500 focus:outline-none"
                placeholder="Maximum height"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-green-800 mb-2">
                Width (mm)
              </label>
              <input
                type="number"
                v-model.number="filters.width"
                class="w-full font-normal rounded-md px-3 py-2 border border-green-300 focus:border-green-500 focus:outline-none"
                placeholder="Maximum width"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-green-800 mb-2">
                Depth (mm)
              </label>
              <input
                type="number"
                v-model.number="filters.depth"
                class="w-full font-normal rounded-md px-3 py-2 border border-green-300 focus:border-green-500 focus:outline-none"
                placeholder="Maximum depth"
              />
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="showDimensionsDialog = false"
              class="px-4 py-2 cursor-pointer bg-gray-200 border-gray-500 rounded-md text-gray-500 shadow-sm hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              @click="applyDimensionsFilters"
              class="px-4 py-2 text-sm font-medium text-green-900 bg-green-200 border-gray-500 rounded-md shadow-md cursor-pointer hover:bg-gray-100"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
      
      <!-- Edit Dialog Component -->
      <edit-item-dialog
          :show-dialog="showEditDialog"
          :editing-item="editingItem"
          :is-new-entry="isNewEntry"
          :is-submitting="isSubmitting"
          :form-errors="formErrors"
          :available-enclosures="availableEnclosures"
          :available-types-hifi="availableTypesHifi"
          :available-types-pa="availableTypesPa"
          :available-specialties="availableSpecialties" 
          @track-change="trackChange"
          @close="closeEditDialog"
          @submit="submitEdit"
          @update-form-errors="formErrors = $event"
      /> 
    </div>
  </div>
</template>
