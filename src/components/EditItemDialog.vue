<script>
export default {
  name: "EditItemDialog",
  props: {
    propShowDialog: {
      type: Boolean,
      required: true
    },
    propEditingItem: {
      type: Object,
      required: true
    },
    isNewEntry: {
      type: Boolean,
      required: true
    },
    availableEnclosures: {
      type: Array,
      required: true
    },
    availableTypesHifi: {
      type: Array,
      required: true
    },
    availableTypesPa: {
      type: Array,
      required: true
    },
    availableSpecialties: {
      type: Array,
      required: true
    }
  },
  mounted() {
      window.addEventListener("keydown", this.handleKeydown);
  },
  unmounted() {
    window.removeEventListener("keydown", this.handleKeydown);
  },
  data() {
    return {
      // initialize internal state from immutable props:
      showDialog: this.propShowDialog,
      editingItem:  { ...this.propEditingItem },
      originalItem: JSON.parse(JSON.stringify(this.propEditingItem)),
      isSubmitting: false,
      formErrors: {
        name: false,
        url: false,
        enclosure: false,
        type: false,
        tabType: false,
      },
    }
  },
  watch: {
    propShowDialog(newValue)            { this.showDialog = newValue; },
    propEditingItem(newValue)           { this.editingItem = { ...newValue }; this.originalItem = { ...newValue }; },
    'editingItem.price'(newValue)       { this.filterNumber('price', newValue); },
    'editingItem.f3'(newValue)          { this.filterNumber('f3', newValue); },
    'editingItem.sensitivity'(newValue) { this.filterNumber('sensitivity', newValue); },
    'editingItem.power'(newValue)       { this.filterNumber('power', newValue); },
    'editingItem.width'(newValue)       { this.filterNumber('width', newValue); },
    'editingItem.height'(newValue)      { this.filterNumber('height', newValue); },
    'editingItem.depth'(newValue)       { this.filterNumber('depth', newValue); }
  },
  methods: {
    handleKeydown(event) {
      if (event.key === "Escape") {
        if (this.showDialog) {
          this.closeEditDialog();
        }
      }
    },

    validateForm() {

      this.formErrors = {
        name: !this.editingItem.name,
        url: !this.editingItem.url,
        enclosure: !this.editingItem.enclosure,
        type: !this.editingItem.type,
        tabType: !this.editingItem.tabType,
      };

      return !Object.values(this.formErrors).some((error) => error);
    },

    closeEditDialog() {
      if (!this.isSubmitting) {
        this.showDialog = false;
        this.editingItem = {};
        this.originalItem = null;
        this.formErrors = {
          name: false,
          url: false,
          enclosure: false,
          type: false,
          tabType: false,
        };
        this.$emit('reset-edit-dialog');
      }
    },

    trackChange(field, value) {
      const fields = ['price', 'f3', 'sensitivity', 'power', 'width', 'height', 'depth'];
      if(fields.includes(field) && value != null && (typeof value == 'string')) {
        value = value.replaceAll(',', '.');
      }

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
    
    async submitEdit() {

      if (!this.validateForm()) {
        return;
      }
      this.fixFloats(['price', 'f3', 'sensitivity', 'power', 'width', 'height', 'depth']);

      this.isSubmitting = true;
      try {
        const url =
          "https://script.google.com/macros/s/AKfycbyVq-XrpTHxH8Nhe_yyUJWKnGdphIAkE0699USXGlrMHNi8JN3-FyrKhAWcBUPmHf8b/exec";
        const _response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            ...this.editingItem,
            isNewEntry: this.isNewEntry,
            tabType: this.editingItem.tabType,
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

    fixFloats(fields) {
      for(const field of fields) {
        const val = this.editingItem[field];
        if(val != null && typeof val == 'string') {
          this.editingItem[field] = val.replaceAll(',', '.');
        }
      }
    },
    filterNumber(field, value) {
      if(value != null && (typeof value == 'string')) {
        let val = value.replace(/[^0-9.,]/g, ''); // Allow numbers, dot, comma
        const parts = val.split(/[.,]/); // Split on either separator

        if (parts.length > 2) {
          // More than one separator: keep only the first
          const firstSeparator = val.match(/[.,]/)[0]; // Get first . or ,
          const [integer, decimal] = val.split(firstSeparator);
          val = `${integer}${firstSeparator}${decimal.replace(/[.,]/g, '')}`;
        }
        if(this.editingItem != null) {
          this.editingItem[field] = val;
        }
      }
    },
  }
}
</script>

<template>
  <div
    v-if="showDialog"
    class="fixed inset-0 flex items-center justify-center p-4 bg-gray-50 z-10"
  >
    <div class="bg-white text-green-900 rounded-md max-w-2xl w-full p-6">
      <h2 class="text-lg font-bold uppercase mb-7">
        {{ isNewEntry ? "Submit New Entry" : "Edit Entry" }}
      </h2>

      <!-- Form Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-green-800 mb-1">
            Name <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            v-model="editingItem.name"
            class="focus:outline-0 text-sm w-full border-b-1 border-gray-300 py-1"
            @input="trackChange('name', editingItem.name)"
          />
          <span
            v-if="formErrors.name"
            class="text-red-500 text-sm"
            >Name is required</span
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-green-800 mb-1">
            Developer
          </label>
          <input
            type="text"
            name="developer"
            v-model="editingItem.developer"
            class="focus:outline-0 text-sm w-full border-b-1 border-gray-300 py-1"
            @input="trackChange('developer', editingItem.developer)"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-green-800 mb-1">
            Price
          </label>
          <input
            type="text"
            name="price"
            v-model="editingItem.price"
            class="focus:outline-0 text-sm w-full border-b-1 border-gray-300 py-1"
            @input="trackChange('price', editingItem.price)"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-green-800 mb-1">
            F₃ (Hz)
          </label>
          <input
            type="text"
            name="f3"
            v-model="editingItem.f3"
            class="focus:outline-0 text-sm w-full border-b-1 border-gray-300 py-1"
            @input="trackChange('f3', editingItem.f3)"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-green-800 mb-1">
            Sensitivity (dB)
          </label>
          <input
            type="text"
            name="sensitivity"
            v-model="editingItem.sensitivity"
            class="focus:outline-0 text-sm w-full border-b-1 border-gray-300 py-1"
            @input="trackChange('sensitivity', editingItem.sensitivity)"
          />
        </div>
        
        <!-- PA-specific fields -->
        <div v-if="editingItem.tabType.startsWith('pa')">
          <label class="block text-sm font-medium text-green-800 mb-1">
            Power (W)
          </label>
          <input
            type="text"
            name="power"
            v-model="editingItem.power"
            class="focus:outline-0 text-sm w-full border-b-1 border-gray-300 py-1"
            @input="trackChange('power', editingItem.power)"
          />
        </div>
        <div v-if="editingItem.tabType.startsWith('pa')">
          <label class="block text-sm font-medium text-green-800 mb-1">
            Range
          </label>
          <input
            type="text"
            name="range"
            v-model="editingItem.range"
            class="focus:outline-0 text-sm w-full border-b-1 border-gray-300 py-1"
            @input="trackChange('range', editingItem.range)"
          />
        </div>
        <div v-if="editingItem.tabType.startsWith('pa')">
          <label class="block text-sm font-medium text-green-800 mb-1">
            Dispersion
          </label>
          <input
            type="text"
            name="dispersion"
            v-model="editingItem.dispersion"
            class="focus:outline-0 text-sm w-full border-b-1 border-gray-300 py-1"
            @input="trackChange('dispersion', editingItem.dispersion)"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-green-800 mb-1">
            Category <span class="text-red-500">*</span>
          </label>
          <select
            v-model="editingItem.tabType"
            name="tabType"
            @change="trackChange('tabType', editingItem.tabType)"
            class="text-sm w-full shadow-sm rounded-md p-2"
          >
            <option value="">Select category...</option>
            <option value="hifi">HiFi</option>
            <option value="hifi-commercial">HiFi Commercial</option>
            <option value="pa">PA</option>
            <option value="pa-commercial">PA Commercial</option>
          </select>
          <span
            v-if="formErrors.tabType"
            class="text-red-500 text-sm"
            >Category is required</span
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-green-800 mb-1">
            Enclosure <span class="text-red-500">*</span>
          </label>
          <select
            v-model="editingItem.enclosure"
            name="enclosure"
            @change="trackChange('enclosure', editingItem.enclosure)"
            class="text-sm w-full shadow-sm rounded-md p-2"
          >
            <option value="">Select enclosure...</option>
            <option
              v-for="enclosure in availableEnclosures"
              :key="enclosure"
              :value="enclosure"
            >
              {{ enclosure }}
            </option>
          </select>
          <span
            v-if="formErrors.enclosure"
            class="text-red-500 text-sm"
            >Enclosure is required</span
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-green-800 mb-1">
            Type <span class="text-red-500">*</span>
          </label>
          <select
            v-model="editingItem.type"
            name="type"
            @change="trackChange('type', editingItem.type)"
            class="text-sm w-full shadow-sm rounded-md p-2"
          >
            <option value="">Select type...</option>
            <option
              v-if="editingItem.tabType.startsWith('hifi')"
              v-for="type in availableTypesHifi"
              :key="type"
              :value="type"
            >
              {{ type }}
            </option>
            <option
              v-if="editingItem.tabType.startsWith('pa')"
              v-for="type in availableTypesPa"
              :key="type"
              :value="type"
            >
              {{ type }}
            </option>
          </select>
          <span
            v-if="formErrors.type"
            class="text-red-500 text-sm"
            >Type is required</span
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-green-800 mb-1">
            Specialty
          </label>
          <select
            v-model="editingItem.specialty"
            name="specialty"
            @change="trackChange('speciality', editingItem.specialty)"
            class="text-sm w-full shadow-sm rounded-md p-2"
          >
            <option value="">Select speciality...</option>
            <option
              v-for="speciality in availableSpecialties"
              :key="speciality"
              :value="speciality"
            >
              {{ speciality }}
            </option>
          </select>
        </div>
        <div class="col-span-full">
          <label class="block text-sm font-medium text-green-800 mb-2"
            >Dimensions H×W×D (mm):</label
          >
          <div class="grid grid-cols-3 gap-4 text-sm">
            <input
              type="text"
              name="height"
              v-model="editingItem.height"
              placeholder="Height"
              class="focus:outline-0 border-b-1 border-gray-300 p-1"
              @input="trackChange('height', editingItem.height)"
            />
            <input
              type="text"
              name="width"
              v-model="editingItem.width"
              placeholder="Width"
              class="focus:outline-0 border-b-1 border-gray-300 p-1"
              @input="trackChange('width', editingItem.width)"
            />
            <input
              type="text"
              name="depth"
              v-model="editingItem.depth"
              placeholder="Depth"
              class="focus:outline-0 border-b-1 border-gray-300 p-1"
              @input="trackChange('depth', editingItem.depth)"
            />
          </div>
        </div>
        <div class="col-span-full">
          <label class="block text-sm font-medium text-green-800 mb-1">
            URL <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="url"
            v-model="editingItem.url"
            class="focus:outline-0 text-sm w-full border-b-1 border-gray-300 py-1"
            @input="trackChange('url', editingItem.url)"
          />
          <span
            v-if="formErrors.url"
            class="text-red-500 text-sm"
            >URL is required</span
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-green-800 mb-1">
            Image URL
          </label>
          <input
            type="text"
            name="image_url"
            v-model="editingItem.image_url"
            class="focus:outline-0 text-sm w-full border-b-1 border-gray-300 py-1"
            @input="trackChange('image_url', editingItem.image_url)"
          />
        </div>
      </div>

      <!-- Dialog Buttons -->
      <div class="mt-6 flex justify-end space-x-3 text-sm">
        <button
          @click="closeEditDialog"
          class="px-3 py-1 cursor-pointer bg-gray-200 border-gray-500 rounded-md text-gray-500 shadow-sm hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          @click="submitEdit"
          class="px-3 py-1 text-sm font-medium text-green-900 bg-green-200 border-gray-500 rounded-md shadow-md cursor-pointer hover:bg-gray-100"
          :disabled="isSubmitting"
        >
          <div class="flex items-center">
            <svg
              v-if="isSubmitting"
              aria-hidden="true"
              class="inline size-4 text-gray-200 animate-spin dark:text-gray-600 fill-white mr-2"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            {{ isSubmitting ? "Saving..." : "Submit" }}
          </div>
        </button>
      </div>
    </div>
  </div>
</template>