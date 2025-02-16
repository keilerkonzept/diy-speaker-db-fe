<script>
import { getMockData } from './services/mockData'

export default {
  name: 'App',
  data() {
    return {
      items: [],
      displayedItems: [],
      page: 1,
      loading: false,
      showDialog: false,
      newEntry: {
        name: ''
      },
      availableEnclosures: [
        "Closed Box",
        "Bass Reflex",
        "TQWT",
        "Horn",
        "Transmission Line",
        "Bandpass",
        "Isobaric",
        "Open Baffle"
      ],
      availableRanges: [
        "Full Range",
        "Top",
        "Subwoofer"
      ],
      availableSpecialties: [
        "Koax",
        "Passive Membrane",
        "Broadband",
        "AMT"
      ],
      filters: {
        name: '',
        price: null,
        enclosures: [],
        ranges: [],
        specialties: [],
        height: null,
        width: null,
        depth: null,
        volume: null,
        developer: '',
        f3: null
      }
    }
  },
  methods: {
    async loadMoreData() {
      if (this.loading) return;
      
      this.loading = true;
      try {
        const newItems = await getMockData(this.page);
        this.items = [...this.items, ...newItems];
        this.applyFilters();
        this.page += 1;
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        this.loading = false;
      }
    },
    
    handleScroll() {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        this.loadMoreData();
      }
    },

    calculateVolume(item) {
      const volumeInLiters = (item.height * item.width * item.depth) / 1000000;
      return volumeInLiters.toFixed(2);
    },

    formatPrice(price) {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
      }).format(price);
    },

    applyFilters() {
      this.displayedItems = this.items.filter(item => {
        if (!item) return false;
        
        const nameMatch = (item.name || '').toLowerCase().includes((this.filters.name || '').toLowerCase());
        const developerMatch = (item.developer || '').toLowerCase().includes((this.filters.developer || '').toLowerCase());
        const enclosureMatch = this.filters.enclosures.length === 0 || this.filters.enclosures.includes(item.enclosure);
        const rangeMatch = this.filters.ranges.length === 0 || this.filters.ranges.includes(item.range);
        const specialtyMatch = this.filters.specialties.length === 0 || this.filters.specialties.includes(item.specialty);
        
        const priceMatch = !this.filters.price || item.price < this.filters.price;
        const heightMatch = !this.filters.height || item.height < this.filters.height;
        const widthMatch = !this.filters.width || item.width < this.filters.width;
        const depthMatch = !this.filters.depth || item.depth < this.filters.depth;
        
        const volumeInLiters = (item.height * item.width * item.depth) / 1000000;
        const volumeMatch = !this.filters.volume || volumeInLiters < this.filters.volume;
        
        const f3Match = !this.filters.f3 || item.f3 < this.filters.f3;
        
        return nameMatch && priceMatch && enclosureMatch && rangeMatch && specialtyMatch && heightMatch && 
               widthMatch && depthMatch && volumeMatch && developerMatch && f3Match;
      });
    },

    clearFilter(filterName) {
      if (['enclosures', 'ranges', 'specialties'].includes(filterName)) {
        this.filters[filterName] = [];
      } else if (['price', 'height', 'width', 'depth', 'volume', 'f3'].includes(filterName)) {
        this.filters[filterName] = null;
      } else {
        this.filters[filterName] = '';
      }
      this.applyFilters();
    },

    submitEntry() {
      // Currently does nothing
      this.showDialog = false;
      this.newEntry.name = '';
    }
  },
  mounted() {
    this.loadMoreData();
    window.addEventListener('scroll', this.handleScroll);
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
</script>

<template>
  <div class="app">
    <header>
      <div class="wrapper">
        <h1>Speaker Database</h1>
        <div class="submit-link">
          <a href="#" @click.prevent="showDialog = true">submit entry</a>
        </div>
      </div>
    </header>

    <div class="data-grid">
      <div>
      <!-- Grid Header -->
      <div class="grid-header">
        <div class="grid-cell">Name</div>
        <div class="grid-cell">Developer</div>
        <div class="grid-cell">Price / pair</div>
        <div class="grid-cell">Enclosure</div>
        <div class="grid-cell">Range</div>
        <div class="grid-cell">F₃</div>
        <div class="grid-cell">Specialty</div>
        <div class="grid-cell">Height</div>
        <div class="grid-cell">Width</div>
        <div class="grid-cell">Depth</div>
        <div class="grid-cell">Volume (L)</div>
      </div>

      <!-- Filter Header -->
      <div class="filters">
        <div class="filter">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="filters.name" 
              placeholder="Filter by name"
              @input="applyFilters"
            >
            <button 
              v-if="filters.name" 
              class="clear-button"
              @click="clearFilter('name')"
            >×</button>
          </div>
        </div>
        <div class="filter">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="filters.developer" 
              placeholder="Filter by developer"
              @input="applyFilters"
            >
            <button 
              v-if="filters.developer" 
              class="clear-button"
              @click="clearFilter('developer')"
            >×</button>
          </div>
        </div>
        <div class="filter">
          <div class="input-wrapper">
            <input 
              type="number"
              v-model.number="filters.price" 
              placeholder="max price"
              @input="applyFilters"
            >
            <button 
              v-if="filters.price" 
              class="clear-button"
              @click="clearFilter('price')"
            >×</button>
          </div>
        </div>
        <div class="filter">
          <div class="input-wrapper filter-wrapper">
            <select 
              multiple
              v-model="filters.enclosures"
              @change="applyFilters"
              class="filter-select"
            >
              <option value="" disabled>Select enclosure...</option>
              <option v-for="enclosure in availableEnclosures" 
                      :key="enclosure" 
                      :value="enclosure">
                {{ enclosure }}
              </option>
            </select>
            <button 
              v-if="filters.enclosures.length"
              class="clear-button"
              @click="clearFilter('enclosures')"
            >×</button>
          </div>
        </div>
        <div class="filter">
          <div class="input-wrapper filter-wrapper">
            <select 
              multiple
              v-model="filters.ranges"
              @change="applyFilters"
              class="filter-select"
            >
              <option value="" disabled>range...</option>
              <option v-for="range in availableRanges" 
                      :key="range" 
                      :value="range">
                {{ range }}
              </option>
            </select>
            <button 
              v-if="filters.ranges.length"
              class="clear-button"
              @click="clearFilter('ranges')"
            >×</button>
          </div>
        </div>
        <div class="filter">
          <div class="input-wrapper">
            <input 
              type="number"
              v-model.number="filters.f3" 
              placeholder="max F₃"
              @input="applyFilters"
            >
            <button 
              v-if="filters.f3" 
              class="clear-button"
              @click="clearFilter('f3')"
            >×</button>
          </div>
        </div>
        <div class="filter">
          <div class="input-wrapper filter-wrapper">
            <select 
              multiple
              v-model="filters.specialties"
              @change="applyFilters"
              class="filter-select"
            >
              <option value="" disabled>specialties...</option>
              <option v-for="specialty in availableSpecialties" 
                      :key="specialty" 
                      :value="specialty">
                {{ specialty }}
              </option>
            </select>
            <button 
              v-if="filters.specialties.length"
              class="clear-button"
              @click="clearFilter('specialties')"
            >×</button>
          </div>
        </div>
        <div class="filter">
          <div class="input-wrapper">
            <input 
              type="number"
              v-model.number="filters.height" 
              placeholder="max height"
              @input="applyFilters"
            >
            <button 
              v-if="filters.height" 
              class="clear-button"
              @click="clearFilter('height')"
            >×</button>
          </div>
        </div>
        <div class="filter">
          <div class="input-wrapper">
            <input 
              type="number"
              v-model.number="filters.width" 
              placeholder="max width"
              @input="applyFilters"
            >
            <button 
              v-if="filters.width" 
              class="clear-button"
              @click="clearFilter('width')"
            >×</button>
          </div>
        </div>
        <div class="filter">
          <div class="input-wrapper">
            <input 
              type="number"
              v-model.number="filters.depth" 
              placeholder="max depth"
              @input="applyFilters"
            >
            <button 
              v-if="filters.depth" 
              class="clear-button"
              @click="clearFilter('depth')"
            >×</button>
          </div>
        </div>
        <div class="filter">
          <div class="input-wrapper">
            <input 
              type="number"
              v-model.number="filters.volume" 
              placeholder="max vol"
              @input="applyFilters"
            >
            <button 
              v-if="filters.volume" 
              class="clear-button"
              @click="clearFilter('volume')"
            >×</button>
          </div>
        </div>
      </div>
    </div>

      <!-- Grid Body -->
      <div class="grid-body">
        <div 
          v-for="item in displayedItems" 
          :key="item.id" 
          class="grid-row"
        >
          <div class="grid-cell">
            <a :href="item.url" target="_blank" class="name-link">{{ item.name }}</a>
          </div>
          <div class="grid-cell">{{ item.developer }}</div>
          <div class="grid-cell">{{ formatPrice(item.price) }}</div>
          <div class="grid-cell">{{ item.enclosure }}</div>
          <div class="grid-cell">{{ item.range }}</div>
          <div class="grid-cell">{{ item.f3 }} Hz</div>
          <div class="grid-cell">{{ item.specialty }}</div>
          <div class="grid-cell">{{ item.height }}</div>
          <div class="grid-cell">{{ item.width }}</div>
          <div class="grid-cell">{{ item.depth }}</div>
          <div class="grid-cell">{{ calculateVolume(item) }}</div>
        </div>
      </div>
    </div>

    <!-- Submit Dialog -->
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog">
        <h2>Submit New Entry</h2>
        <div class="dialog-content">
          <input 
            type="text" 
            v-model="newEntry.name" 
            placeholder="Enter name"
            class="dialog-input"
          >
        </div>
        <div class="dialog-buttons">
          <button @click="showDialog = false" class="cancel-button">Cancel</button>
          <button @click="submitEntry" class="submit-button">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Reset default margins and padding */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

.app {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

header {
  background-color: #f5f5f5;
  color: #555555;
  padding: 1rem;
  text-align: center;
}

.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 20px;
}

.submit-link a {
  color: #2c3e50;
  text-decoration: none;
  font-weight: normal;
}

.submit-link a:hover {
  text-decoration: underline;
}

.data-grid {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: white;
  position: relative;
  z-index: 1;
}

.grid-header {
  display: grid;
  grid-template-columns: 1.2fr 1.2fr 0.8fr 0.8fr 0.6fr 0.5fr 0.8fr 0.5fr 0.5fr 0.5fr 0.6fr;
  gap: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
  position: sticky;
  top: 20px;
  z-index: 3;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-left: -20px;
  margin-right: -20px;
  padding-left: 20px;
  padding-right: 20px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.filters {
  display: grid;
  grid-template-columns: 1.2fr 1.2fr 0.8fr 0.8fr 0.6fr 0.5fr 0.8fr 0.5fr 0.5fr 0.5fr 0.6fr;
  gap: 10px;
  margin-bottom: 20px;
  position: sticky;
  top: 90px;
  background: white;
  z-index: 2;
  padding: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-left: -20px;
  margin-right: -20px;
  padding-left: 20px;
  padding-right: 20px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.filter input {
  width: 100%;
  padding: 8px;
  padding-right: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.clear-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  font-size: 18px;
  cursor: pointer;
  padding: 0 5px;
  line-height: 1;
}

.clear-button:hover {
  color: #666;
}

.grid-body {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  background: white;
  transform: translateZ(0);
}

.grid-row {
  display: grid;
  grid-template-columns: 1.2fr 1.2fr 0.8fr 0.8fr 0.6fr 0.5fr 0.8fr 0.5fr 0.5fr 0.5fr 0.6fr;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  background: white;
}

.grid-row:hover {
  background-color: #f9f9f9;
}

.grid-cell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 5px;
}

.filter input[type="number"] {
  width: 100%;
  padding: 8px;
  padding-right: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filter input[type="number"]::-webkit-inner-spin-button,
.filter input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.filter input[type="number"] {
  -moz-appearance: textfield;
}

.name-link {
  color: #2c3e50;
  text-decoration: none;
}

.name-link:hover {
  text-decoration: underline;
  color: #1a2634;
}

.filter-wrapper {
  position: relative;
  width: 100%;
}

.filter-select {
  width: 100%;
  height: 34px;
  padding: 6px 32px 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  font-size: inherit;
  line-height: 1.4;
}

.filter-select:focus {
  outline: none;
  border-color: #aaa;
}

.filter-select[multiple] {
  position: relative;
}

.filter-select[multiple]:focus {
  position: absolute;
  z-index: 1000;
  min-height: 150px;
  height: auto;
}

.filter-select option {
  padding: 4px 8px;
}

.filter-select option:checked {
  background-color: #e0e0e0;
}

.filter-select option[value=""][disabled] {
  color: #999;
}

.filter input,
.filter select {
  height: 34px;
  padding: 6px 32px 6px 8px;
  font-size: inherit;
  line-height: 1.4;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 90%;
}

.dialog h2 {
  margin: 0 0 20px 0;
  font-size: 1.2em;
  color: #2c3e50;
}

.dialog-content {
  margin-bottom: 20px;
}

.dialog-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: inherit;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button, .submit-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: inherit;
}

.cancel-button {
  background: #f5f5f5;
  color: #666;
}

.submit-button {
  background: #2c3e50;
  color: white;
}

.cancel-button:hover {
  background: #e0e0e0;
}

.submit-button:hover {
  background: #1a2634;
}
</style>
