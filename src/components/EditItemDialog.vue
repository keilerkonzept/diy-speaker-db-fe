<script>
export default {
  name: "EditItemDialog",
  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    editingItem: {
      type: Object,
      required: true
    },
    isNewEntry: {
      type: Boolean,
      required: true
    },
    isSubmitting: {
      type: Boolean,
      required: true
    },
    formErrors: {
      type: Object,
      required: true
    },
    availableEnclosures: {
      type: Array,
      required: true
    },
    availableTypes: {
      type: Array,
      required: true
    },
    availableSpecialties: {
      type: Array,
      required: true
    }
  },
  methods: {
    validateForm() {
      if (!this.isNewEntry) return true;

      const formErrors = {
        name: !this.editingItem.name,
        url: !this.editingItem.url,
        enclosure: !this.editingItem.enclosure,
        type: !this.editingItem.type,
        tabType: !this.editingItem.tabType,
      };

      // Emit the form errors to update parent component
      this.$emit('update-form-errors', formErrors);

      return !Object.values(formErrors).some((error) => error);
    },
    trackChange(field, value) {
      this.$emit('track-change', field, value);
    },
    closeDialog() {
      this.$emit('close');
    },
    submitEdit() {
      if (!this.validateForm()) {
        return;
      }
      this.$emit('submit');
    }
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
        <!-- Name Field -->
        <div>
          <label class="block text-sm font-medium text-green-800 mb-1">
            Name <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            v-model="editingItem.name"
            class="focus:outline-0 text-sm w-full border-b-1 border-gray-300 py-1"
            @input="trackChange('name', editingItem.name)"
          />
          <span
            v-if="isNewEntry && formErrors.name"
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
            type="number"
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
            type="number"
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
            type="number"
            v-model="editingItem.sensitivity"
            class="focus:outline-0 text-sm w-full border-b-1 border-gray-300 py-1"
            @input="trackChange('sensitivity', editingItem.sensitivity)"
          />
        </div>
        
        <!-- PA-specific fields -->
        <div v-if="editingItem.tabType === 'pa'">
          <label class="block text-sm font-medium text-green-800 mb-1">
            Power (W)
          </label>
          <input
            type="number"
            v-model="editingItem.power"
            class="focus:outline-0 text-sm w-full border-b-1 border-gray-300 py-1"
            @input="trackChange('power', editingItem.power)"
          />
        </div>
        <div v-if="editingItem.tabType === 'pa'">
          <label class="block text-sm font-medium text-green-800 mb-1">
            Range
          </label>
          <input
            type="text"
            v-model="editingItem.range"
            class="focus:outline-0 text-sm w-full border-b-1 border-gray-300 py-1"
            @input="trackChange('range', editingItem.range)"
          />
        </div>
        <div v-if="editingItem.tabType === 'pa'">
          <label class="block text-sm font-medium text-green-800 mb-1">
            Dispersion
          </label>
          <input
            type="text"
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
            @change="trackChange('tabType', editingItem.tabType)"
            class="text-sm w-full shadow-sm rounded-md p-2"
          >
            <option value="hifi">HiFi</option>
            <option value="hifi-commercial">HiFi Commercial</option>
            <option value="pa">PA</option>
            <option value="pa-commercial">PA Commercial</option>
          </select>
          <span
            v-if="isNewEntry && formErrors.tabType"
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
            v-if="isNewEntry && formErrors.enclosure"
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
            @change="trackChange('type', editingItem.type)"
            class="text-sm w-full shadow-sm rounded-md p-2"
          >
            <option value="">Select type...</option>
            <option
              v-for="type in availableTypes"
              :key="type"
              :value="type"
            >
              {{ type }}
            </option>
          </select>
          <span
            v-if="isNewEntry && formErrors.type"
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
              type="number"
              v-model="editingItem.height"
              placeholder="Height"
              class="focus:outline-0 border-b-1 border-gray-300 p-1"
              @input="trackChange('height', editingItem.height)"
            />
            <input
              type="number"
              v-model="editingItem.width"
              placeholder="Width"
              class="focus:outline-0 border-b-1 border-gray-300 p-1"
              @input="trackChange('width', editingItem.width)"
            />
            <input
              type="number"
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
            v-model="editingItem.url"
            class="focus:outline-0 text-sm w-full border-b-1 border-gray-300 py-1"
            @input="trackChange('url', editingItem.url)"
          />
          <span
            v-if="isNewEntry && formErrors.url"
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
            v-model="editingItem.image_url"
            class="focus:outline-0 text-sm w-full border-b-1 border-gray-300 py-1"
            @input="trackChange('image_url', editingItem.image_url)"
          />
        </div>
      </div>

      <!-- Dialog Buttons -->
      <div class="mt-6 flex justify-end space-x-3 text-sm">
        <button
          @click="closeDialog"
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