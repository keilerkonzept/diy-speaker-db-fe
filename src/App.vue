<script>
import { getData } from './services/data'

export default {
  name: 'App',
  data() {
    return {
      items: getData(),
      displayedItems: [],
      showDialog: false,
      newEntry: {
        name: ''
      },
      availableEnclosures: [
        "Closed Box",
        "CB w Series Cap",
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
      },
      showEditDialog: false,
      editingItem: null,
      isSubmitting: false,
      originalItem: null,
      isNewEntry: false,
      formErrors: {
        name: false,
        url: false,
        enclosure: false,
        range: false
      }
    }
  },
  methods: {

    loadData() {
        this.items = getData();
        this.applyFilters();
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
        document.querySelector(`[name='filter-${filterName}']`).selectedIndex = 0;
      } else if (['price', 'height', 'width', 'depth', 'volume', 'f3'].includes(filterName)) {
        this.filters[filterName] = null;
      } else {
        this.filters[filterName] = '';
      }
      this.applyFilters();
    },

    createNewEntry() {
      this.isNewEntry = true;
      this.editingItem = {
        name: '',
        developer: '',
        price: null,
        enclosure: '',
        range: '',
        f3: null,
        specialty: '',
        height: null,
        width: null,
        depth: null,
        url: '',
        changes: {}
      };
      this.originalItem = { ...this.editingItem };
      this.showEditDialog = true;
    },

    editItem(item) {
      this.isNewEntry = false;
      this.editingItem = { 
        ...item,
        changes: {}
      };
      this.originalItem = { ...item };
      this.showEditDialog = true;
    },

    trackChange(field, value) {
      if (JSON.stringify(this.originalItem[field]) !== JSON.stringify(value)) {
        this.editingItem.changes[field] = {
          from: this.originalItem[field],
          to: value
        };
      } else {
        delete this.editingItem.changes[field];
      }
    },

    closeEditDialog() {
      if (!this.isSubmitting) {
        this.showEditDialog = false;
        this.editingItem = null;
        this.originalItem = null;
        this.isNewEntry = false;
        this.formErrors = {
          name: false,
          url: false,
          enclosure: false,
          range: false
        };
      }
    },

    validateForm() {
      if (!this.isNewEntry) return true;
      
      this.formErrors = {
        name: !this.editingItem.name,
        url: !this.editingItem.url,
        enclosure: !this.editingItem.enclosure,
        range: !this.editingItem.range
      };

      return !Object.values(this.formErrors).some(error => error);
    },

    async submitEdit() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;
      try {
        const url = 'https://script.google.com/macros/s/AKfycbyVq-XrpTHxH8Nhe_yyUJWKnGdphIAkE0699USXGlrMHNi8JN3-FyrKhAWcBUPmHf8b/exec';
        const _response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            ...this.editingItem,
            isNewEntry: this.isNewEntry,
            timestamp: new Date().toISOString()
          }),
          headers: {
            'Content-Type': 'application/json'
          },
          mode: 'no-cors'
        });
        
        this.isSubmitting = false;
        this.closeEditDialog();
      } catch (error) {
        alert('Error saving data: ' + error.toString());
      } finally {
        this.isSubmitting = false;
      }
    },

    handleKeydown(event) {
      if (event.key === 'Escape') {
        if (this.showEditDialog) {
          this.closeEditDialog();
        }
        if (this.showDialog) {
          this.showDialog = false;
        }
      }
    }
  },
  mounted() {
    this.loadData();
    window.addEventListener('keydown', this.handleKeydown);
  },
  unmounted() {
    window.removeEventListener('keydown', this.handleKeydown);
  }
}
</script>

<template>
  <div class="app">
    <div class="table-container">
      <div style="">
        <button class="edit-button" @click="createNewEntry">Submit New Entry</button>
       </div>
      <table class="data-table">
        <thead>
          <tr class="header-row">
            <th class="col-name">Name</th>
            <th class="col-developer">Developer</th>
            <th class="col-price">Price / pair</th>
            <th class="col-enclosure">Enclosure</th>
            <th class="col-range">Range</th>
            <th class="col-f3">F₃</th>
            <th class="col-specialty">Specialty</th>
            <th class="col-height">Height</th>
            <th class="col-width">Width</th>
            <th class="col-depth">Depth</th>
            <th class="col-volume">Volume (L)</th>
            <th class="col-actions"></th>
          </tr>
          <tr class="filter-row">
            <th class="col-name">
              <div class="input-wrapper">
                <input 
                  type="text" 
                  name="filter-name"
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
            </th>
            <th class="col-developer">
              <div class="input-wrapper">
                <input 
                  type="text" 
                  name="filter-developer"
                  v-model="filters.developer" 
                  placeholder=""
                  @input="applyFilters"
                >
                <button 
                  v-if="filters.developer" 
                  class="clear-button"
                  @click="clearFilter('developer')"
                >×</button>
              </div>
            </th>
            <th class="col-price">
              <div class="input-wrapper">
                <input 
                  type="number"
                  name="filter-price"
                  v-model.number="filters.price" 
                  placeholder="< €"
                  @input="applyFilters"
                >
                <button 
                  v-if="filters.price" 
                  class="clear-button"
                  @click="clearFilter('price')"
                >×</button>
              </div>
            </th>
            <th class="col-enclosure">
              <div class="input-wrapper filter-wrapper">
                <select 
                  multiple
                  name="filter-enclosures"
                  v-model="filters.enclosures"
                  @change="applyFilters"
                  class="filter-select"
                >
                  <option value="" disabled selected>Select...</option>
                  <option v-for="enclosure in availableEnclosures" 
                          :key="enclosure" 
                          :value="enclosure">
                    {{ enclosure }}
                  </option>
                </select>
                <button 
                  v-if="filters.enclosures.length"
                  class="clear-button"
                  @click.prevent="clearFilter('enclosures')"
                >×</button>
              </div>
            </th>
            <th class="col-range">
              <div class="input-wrapper filter-wrapper">
                <select 
                  multiple
                  name="filter-ranges"
                  v-model="filters.ranges"
                  @change="applyFilters"
                  class="filter-select"
                >
                  <option value="" disabled selected>Select...</option>
                  <option v-for="range in availableRanges" 
                          :key="range" 
                          :value="range">
                    {{ range }}
                  </option>
                </select>
                <button 
                  v-if="filters.ranges.length"
                  class="clear-button"
                  @click.prevent="clearFilter('ranges')"
                >×</button>
              </div>
            </th>
            <th class="col-f3">
              <div class="input-wrapper">
                <input 
                  type="number"
                  name="filter-f3"
                  v-model.number="filters.f3" 
                  placeholder="> F₃"
                  @input="applyFilters"
                >
                <button 
                  v-if="filters.f3" 
                  class="clear-button"
                  @click="clearFilter('f3')"
                >×</button>
              </div>
            </th>
            <th class="col-specialty">
              <div class="input-wrapper filter-wrapper">
                <select 
                  multiple
                  name="filter-specialties"
                  v-model="filters.specialties"
                  @change="applyFilters"
                  class="filter-select"
                >
                  <option value="" disabled selected>Select...</option>
                  <option v-for="specialty in availableSpecialties" 
                          :key="specialty" 
                          :value="specialty">
                    {{ specialty }}
                  </option>
                </select>
                <button 
                  v-if="filters.specialties.length"
                  class="clear-button"
                  @click.prevent="clearFilter('specialties')"
                >×</button>
              </div>
            </th>
            <th class="col-height">
              <div class="input-wrapper">
                <input 
                  type="number"
                  name="filter-height"
                  v-model.number="filters.height" 
                  placeholder="< H"
                  @input="applyFilters"
                >
                <button 
                  v-if="filters.height" 
                  class="clear-button"
                  @click="clearFilter('height')"
                >×</button>
              </div>
            </th>
            <th class="col-width">
              <div class="input-wrapper">
                <input 
                  type="number"
                  name="filter-width"
                  v-model.number="filters.width" 
                  placeholder="< W"
                  @input="applyFilters"
                >
                <button 
                  v-if="filters.width" 
                  class="clear-button"
                  @click="clearFilter('width')"
                >×</button>
              </div>
            </th>
            <th class="col-depth">
              <div class="input-wrapper">
                <input 
                  type="number"
                  name="filter-depth"
                  v-model.number="filters.depth" 
                  placeholder="< D"
                  @input="applyFilters"
                >
                <button 
                  v-if="filters.depth" 
                  class="clear-button"
                  @click="clearFilter('depth')"
                >×</button>
              </div>
            </th>
            <th class="col-volume">
              <div class="input-wrapper">
                <input 
                  type="number"
                  name="filter-volume"
                  v-model.number="filters.volume" 
                  placeholder="< L"
                  @input="applyFilters"
                >
                <button 
                  v-if="filters.volume" 
                  class="clear-button"
                  @click="clearFilter('volume')"
                >×</button>
              </div>
            </th>
            <th class="col-actions"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in displayedItems" 
              :key="`${item.name}-${item.developer}-${index}`"
              class="data-row">
            <td><a :href="item.url" target="_blank" class="name-link">{{ item.name }}</a></td>
            <td>{{ item.developer }}</td>
            <td>{{ formatPrice(item.price) }}</td>
            <td>{{ item.enclosure }}</td>
            <td>{{ item.range }}</td>
            <td>{{ item.f3 }} Hz</td>
            <td>{{ item.specialty }}</td>
            <td>{{ item.height }}</td>
            <td>{{ item.width }}</td>
            <td>{{ item.depth }}</td>
            <td>{{ calculateVolume(item) }} L</td>
            <td><button class="edit-button" @click="editItem(item)">Edit</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Combined Edit/Create Dialog -->
    <div v-if="showEditDialog" class="dialog-overlay">
      <div class="dialog edit-dialog">
        <h2>{{ isNewEntry ? 'Submit New Entry' : 'Edit Entry' }}</h2>
        <div class="dialog-content edit-form-grid">
          <div class="form-group">
            <label>Name: <span class="required">*</span></label>
            <input 
              type="text" 
              v-model="editingItem.name"
              @input="trackChange('name', editingItem.name)"
              :class="{ 'error': isNewEntry && formErrors.name }"
            >
            <span v-if="isNewEntry && formErrors.name" class="error-message">Name is required</span>
          </div>
          <div class="form-group">
            <label>Developer:</label>
            <input 
              type="text" 
              v-model="editingItem.developer"
              @input="trackChange('developer', editingItem.developer)"
            >
          </div>
          <div class="form-group">
            <label>Price:</label>
            <input 
              type="number" 
              v-model="editingItem.price"
              @input="trackChange('price', editingItem.price)"
            >
          </div>
          <div class="form-group">
            <label>F₃:</label>
            <input 
              type="number" 
              v-model="editingItem.f3"
              @input="trackChange('f3', editingItem.f3)"
            >
          </div>
          <div class="form-group">
            <label>Enclosure: <span class="required">*</span></label>
            <select 
              v-model="editingItem.enclosure"
              @change="trackChange('enclosure', editingItem.enclosure)"
              :class="{ 'error': isNewEntry && formErrors.enclosure }"
            >
              <option value="">Select enclosure...</option>
              <option v-for="enclosure in availableEnclosures" 
                      :key="enclosure" 
                      :value="enclosure">
                {{ enclosure }}
              </option>
            </select>
            <span v-if="isNewEntry && formErrors.enclosure" class="error-message">Enclosure is required</span>
          </div>
          <div class="form-group">
            <label>Range: <span class="required">*</span></label>
            <select 
              v-model="editingItem.range"
              @change="trackChange('range', editingItem.range)"
              :class="{ 'error': isNewEntry && formErrors.range }"
            >
              <option value="">Select range...</option>
              <option v-for="range in availableRanges" 
                      :key="range" 
                      :value="range">
                {{ range }}
              </option>
            </select>
            <span v-if="isNewEntry && formErrors.range" class="error-message">Range is required</span>
          </div>
          <div class="form-group">
            <label>Specialty:</label>
            <select 
              v-model="editingItem.specialty"
              @change="trackChange('specialty', editingItem.specialty)"
            >
              <option value="">Select specialty...</option>
              <option v-for="specialty in availableSpecialties" 
                      :key="specialty" 
                      :value="specialty">
                {{ specialty }}
              </option>
            </select>
          </div>
          <div class="form-group dimensions">
            <label>Dimensions (H×W×D):</label>
            <div class="dimension-inputs">
              <input 
                type="number" 
                v-model="editingItem.height" 
                placeholder="Height"
                @input="trackChange('height', editingItem.height)"
              >
              <input 
                type="number" 
                v-model="editingItem.width" 
                placeholder="Width"
                @input="trackChange('width', editingItem.width)"
              >
              <input 
                type="number" 
                v-model="editingItem.depth" 
                placeholder="Depth"
                @input="trackChange('depth', editingItem.depth)"
              >
            </div>
          </div>
          <div class="form-group full-width">
            <label>URL: <span class="required">*</span></label>
            <input 
              type="text" 
              v-model="editingItem.url"
              @input="trackChange('url', editingItem.url)"
              :class="{ 'error': isNewEntry && formErrors.url }"
            >
            <span v-if="isNewEntry && formErrors.url" class="error-message">URL is required</span>
          </div>
        </div>
        <div class="dialog-buttons">
          <button 
            @click="closeEditDialog" 
            class="cancel-button"
            :disabled="isSubmitting"
          >Cancel</button>
          <button 
            @click="submitEdit" 
            class="submit-button"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="spinner"></span>
            {{ isSubmitting ? 'Saving...' : 'Submit' }}
          </button>
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

html, body {
  margin: 0;
  padding: 0;
  min-height: 100%;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

.app {
  width: 100%;
  margin: 0;
  padding: 0;
}

header {
  background-color: #f5f5f5;
  color: #555555;
  padding: 1rem;
  text-align: center;
  margin: 0;  /* Remove margin */
}

.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
  margin: 0;
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

.sticky-container {
  position: sticky;
  top: 0;
  z-index: 3;
  background: white;
  transform: translateZ(0);  /* Force GPU acceleration */
  backface-visibility: hidden;
}

.filters {
  display: grid;
  grid-template-columns: 1.2fr 1.2fr 0.8fr 0.8fr 0.6fr 0.5fr 0.8fr 0.5fr 0.5fr 0.5fr 0.6fr 0.4fr;
  gap: 10px;
  padding: 10px;
  margin-right: 20px;
  margin-left: 20px;  /* Added left margin */
  padding-left: 20px;  /* Added left padding */
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.input-wrapper {
  /* position: relative; */
  width: 100%;
}

.filter input {
  width: 100%;
  padding: 8px;
  /* padding-right: 30px; */
  border: 1px solid #ddd;
  border-radius: 4px;
}

.clear-button {
  position: absolute;
  right: 24px;
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

.data-grid {
  display: flex;
  flex-direction: column;
  background: white;
  contain: content;  /* Optimize browser rendering */
  position: relative;
  z-index: 1;
  margin-top: 0;
  padding-right: 20px;  /* Added right padding */
}

.filter input[type="number"] {
  width: 100%;
  padding: 8px;
  padding-right: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Remove spinner buttons from number inputs */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;  /* Firefox */
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
  position: relative;  /* Create positioning context for absolute select */
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
  height: 34px;
  overflow: hidden;
  width: 100%;  /* Ensure consistent width */
}

.filter-select[multiple]:focus {
  position: absolute;
  height: 150px;
  overflow: auto;
  background: white;
  z-index: 1000;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;  /* Maintain width when expanded */
  left: 0;      /* Align to left edge of container */
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

.edit-button {
  padding: 4px 8px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  white-space: nowrap;  /* Prevent button text from wrapping */
  min-width: fit-content;  /* Ensure button fits content */
  margin-bottom: 10px;
  margin-top: 10px;
}

.edit-button:hover {
  background: #e0e0e0;
}

.edit-dialog {
  width: 600px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.edit-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 10px 0;
}

.form-group {
  position: relative;
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 3px;
  font-weight: bold;
  color: #666;
  font-size: 0.9em;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9em;
}

.error-message {
  color: #ff4444;
  font-size: 0.75em;
  margin-top: 2px;
  display: block;
  position: absolute;
}

.dialog-content {
  margin: 10px 0;
}

.dialog-buttons {
  padding-top: 10px;
  border-top: 1px solid #eee;
  margin-top: 10px;
}

.dimension-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}

.form-group.dimensions {
  grid-column: 1 / -1;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group:has(.error-message) {
  margin-bottom: 15px;
}

.edit-dialog h2 {
  margin: 0;
  padding: 10px 0;
  font-size: 1.2em;
}

.spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 8px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.submit-button:disabled,
.cancel-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
}

.required {
  color: #ff4444;
  margin-left: 2px;
}

.error {
  border-color: #ff4444 !important;
}

.table-container {
  margin: 0 20px;
}

.data-table {
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  table-layout: fixed;
  position: relative;
}

.data-table thead {
  position: sticky;
  top: 0;
  z-index: 2;
  background: white;
}

.header-row th {
  position: sticky;
  top: 0;
  background: #f5f5f5;
  z-index: 2;
  padding: 10px;
  text-align: left;
  font-weight: bold;
  white-space: nowrap;
  border-bottom: 2px solid #ddd;
}

.filter-row th {
  position: sticky;
  background: white;
  z-index: 2;
  padding: 10px;
  font-weight: normal;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Add box-shadow to create visual separation */
.data-table thead::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), transparent);
}

.data-row td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.data-row:hover {
  background-color: #f9f9f9;
}

/* Column widths with semantic classes */
.col-name { width: 15%; }      /* Name */
.col-developer { width: 12%; }  /* Developer */
.col-price { width: 90px; }      /* Price */
.col-enclosure { width: 12%; }  /* Enclosure */
.col-range { width: 8%; }       /* Range */
.col-f3 { width: 90px; }         /* F3 */
.col-specialty { width: 10%; }  /* Specialty */
.col-height { width: 90px; }      /* Height */
.col-width { width: 90px; }       /* Width */
.col-depth { width: 90px; }       /* Depth */
.col-volume { width: 90px; }      /* Volume */
.col-actions { width: 50px; }     /* Edit button */

/* Remove old nth-child selectors */
/* .data-table th:nth-child(...) { ... } */

/* Keep existing input styles */
.input-wrapper {
  position: relative;
  width: 100%;
}

.input-wrapper input,
.input-wrapper select {
  width: 100%;
  padding: 8px;
  padding-right: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Ensure the body takes up full height */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.data-table tbody {
  padding-top: 86px;  /* Keep it at the expected height */
  display: table-row-group;  /* Changed from block to table-row-group */
}

.data-table thead {
  position: sticky;
  top: 0;
  z-index: 2;
  background: white;
  width: 100%;
}

/* Remove the first-child margin since we're using table-row-group */
.data-table tbody tr:first-child {
  margin-top: 0;
}

</style>
