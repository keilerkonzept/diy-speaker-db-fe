  <script>
export default {
  name: "App",
  data() {
    return {
      items: [],
      displayedItems: [],
      showDialog: false,
      newEntry: {
        name: "",
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
        "Open Baffle",
        "FAST"
      ],
      availableTypes: ["Floor", "Compact", "Subwoofer", "Wall"],
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
        type: false,
      },
      selectedEnclosure: "",
      selectedType: "",
      selectedSpecialty: "",
    };
  },
  methods: {
    async loadData() {
      const url =
        "https://sheets.googleapis.com/v4/spreadsheets/1PoYey8POjJOA-ucpMtjJpdDWmXww5tK5HlhHbNeUZrs/values/live?alt=json&key=AIzaSyCi5Azx-KvH8rfE3oTlRERkchMcSH-9dvA";
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        json.values.shift(); // remove header row

        json.values.forEach((item) => {
          this.items.push({
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
          });
        });
        this.applyFilters();
      } catch (error) {
        alert(error.message);
      }
    },

    calculateVolume(item) {
      const volumeInLiters = (item.height * item.width * item.depth) / 1000000;
      return volumeInLiters.toFixed(2);
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
          sensitivityMatch
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
        ["price", "height", "width", "depth", "volume", "f3", "sensitivity"].includes(
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
        changes: {},
      };
      this.originalItem = { ...this.editingItem };
      this.showEditDialog = true;
    },

    editItem(item) {
      this.isNewEntry = false;
      this.editingItem = {
        ...item,
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
        this.editingItem = null;
        this.originalItem = null;
        this.isNewEntry = false;
        this.formErrors = {
          name: false,
          url: false,
          enclosure: false,
          type: false,
        };
      }
    },

    validateForm() {
      if (!this.isNewEntry) return true;

      this.formErrors = {
        name: !this.editingItem.name,
        url: !this.editingItem.url,
        enclosure: !this.editingItem.enclosure,
        type: !this.editingItem.type,
      };

      return !Object.values(this.formErrors).some((error) => error);
    },

    async submitEdit() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;
      try {
        const url =
          "https://script.google.com/macros/s/AKfycbyVq-XrpTHxH8Nhe_yyUJWKnGdphIAkE0699USXGlrMHNi8JN3-FyrKhAWcBUPmHf8b/exec";
        const _response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            ...this.editingItem,
            isNewEntry: this.isNewEntry,
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
      }
    },
  },
  mounted() {
    this.loadData();
    window.addEventListener("keydown", this.handleKeydown);
  },
  unmounted() {
    window.removeEventListener("keydown", this.handleKeydown);
  },
};
</script>

  <template>
  <div class="overflow-scroll h-screen">
    <!-- Header -->
    <div class="left-0 text-md tracking-wide font-semibold w-full text-green-700 mt-4 mb-8">
      <div class="flex items-center justify-between rounded-md mx-4 p-2" style="background-color: var(--color-gray-50)">
        <a href="/">
          <span class="uppercase tracking-wide px-2 whitespace-nowrap">DIY Speaker DB</span>
        </a>
        <button
          @click="createNewEntry"
          class="px-3 py-2 font-medium bg-white text-sm text-green-700 rounded-md shadow-md cursor-pointer hover:bg-gray-100 hover:text-gray-900"
        >
          Submit New Entry
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container min-w-full mx-auto px-4 ">
      <!-- Table -->
      <div
        class=" min-w-full w-fit rounded-lg p-1"
      >
        <table class="min-w-full table-fixed divide-y divide-gray-200">
          <thead class="sticky top-0 text-green-700 bg-gray-50">
            <!-- Header Row -->
            <tr class="text-sm uppercase">
              <th
                scope="col"
                class="min-w-[70pt] w-[70pt] px-3 py-3"
              >
              </th>
              <th
                scope="col"
                class="min-w-[120pt] w-[250pt] px-3 py-3"
              >
                Name
              </th>
              <th
                scope="col"
                class="min-w-[100pt] w-[200pt] px-3 py-3"
              >
                Developer
              </th>
              <th
                scope="col"
                class="min-w-[70pt] w-[70pt] px-3 py-3"
              >
                Price
              </th>
              <th
                scope="col"
                class="min-w-[80pt] w-[100pt] px-3 py-3"
              >
                Enclosure
              </th>
              <th
                scope="col"
                class="min-w-[80pt] w-[90pt] px-3 py-3"
              >
                Type
              </th>
              <th
                scope="col"
                class="min-w-[60pt] w-[60pt] px-3 py-3"
              >
                F₃
              </th>
              <th
                scope="col"
                class="min-w-[60pt] w-[60pt] px-3 py-3"
              >
                Sensitivity
              </th>
              <th
                scope="col"
                class="min-w-[80pt] w-[120pt] px-3 py-3"
              >
                Specialty
              </th>
              <th
                scope="col"
                class="min-w-[20pt] w-[20pt] px-3 py-3"
              >
                Height
              </th>
              <th
                scope="col"
                class="min-w-[20pt] w-[20pt] px-3 py-3"
              >
                Width
              </th>
              <th
                scope="col"
                class="min-w-[20pt] w-[20pt] px-3 py-3"
              >
                Depth
              </th>
              <th
                scope="col"
                class="w-[30pt] px-3 py-3"
              >
                Volume
              </th>
              <th
                scope="col"
                class="min-w-[40pt] px-3 py-3"
              ></th>
            </tr>

            <!-- Filter Row -->
            <tr class="align-baseline text-sm">
              <th class="px-3 py-3"></th>
              <th class="px-3 py-3">
                <input
                  type="text"
                  v-model="filters.name"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('name')"
                  class="w-full font-normal rounded-md px-2 py-1 bg-white border-green-300 text-gray-900"
                  placeholder="Filter by name"
                />
              </th>
              <th class="px-3 py-3">
                <input
                  type="text"
                  v-model="filters.developer"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('developer')"
                  class="w-full font-normal rounded-md px-2 py-1 bg-white border-green-300 text-gray-900 focus:border-green-500"
                  placeholder="Filter by developer"
                />
              </th>
              <th class="px-3 py-3">
                <input
                  type="number"
                  v-model.number="filters.price"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('price')"
                  class="w-full font-normal rounded-md px-2 py-1 text-gray-900 bg-white border-green-300 focus:border-green-500"
                  placeholder="< €"
                />
              </th>
              <th class="px-3 py-3">
                <div class="relative">
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
              </th>
              <th class="px-3 py-3">
                <div class="relative">
                  <select
                    v-model="selectedType"
                    @change="addFilter('types', selectedType)"
                    class="w-full font-normal text-gray-500 rounded-md mt-1 px-2 py-1 bg-white border-green-300 focus:border-green-500"
                  >
                    <option value="">Select...</option>
                    <option
                      v-for="type in availableTypes"
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
              </th>
              <th class="px-3 py-3">
                <input
                  type="number"
                  v-model.number="filters.f3"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('f3')"
                  class="w-full font-normal text-gray-900 rounded-md px-2 py-1 bg-white border-green-300 focus:border-green-500"
                  placeholder="> F₃"
                />
              </th>
              <th class="px-3 py-3">
                <input
                  type="number"
                  name="filter-sensitivity"
                  v-model.number="filters.sensitivity"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('sensitivity')"
                  class="w-full font-normal text-gray-900 rounded-md px-2 py-1 bg-white border-green-300 focus:border-green-500"
                  placeholder="> dB"
                />
              </th>
              <th class="px-3 py-3">
                <div class="relative">
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
              </th>
              <th class="px-3 py-3">
                <input
                  type="number"
                  v-model.number="filters.height"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('height')"
                  class="w-full font-normal rounded-md px-2 py-1 bg-white text-gray-900 border-green-300 focus:border-green-500"
                  placeholder="< H"
                />
              </th>
              <th class="px-3 py-3">
                <input
                  type="number"
                  v-model.number="filters.width"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('width')"
                  class="w-full font-normal rounded-md px-2 py-1 bg-white text-gray-900 border-green-300 focus:border-green-500"
                  placeholder="< W"
                />
              </th>
              <th class="px-3 py-3">
                <input
                  type="number"
                  v-model.number="filters.depth"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('depth')"
                  class="w-full font-normal rounded-md px-2 py-1 bg-white text-gray-900 border-green-300 focus:border-green-500"
                  placeholder="< D"
                />
              </th>
              <th class="px-3 py-3">
                <input
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
              <td  class="px-3 py-4">
                <a
                  v-if="item.image_url"
                  :href="item.url"
                  target="_blank"
                  class=""
                >
                <div class="overflow-hidden rounded-sm">
                <img v-if="item.image_url"
                     :src="item.image_url"
                     :alt="item.name"
                     class="hover:scale-105"/>
                     </div>
              </a>
              </td>
              <td class="px-3 py-4">
                <a
                  :href="item.url"
                  target="_blank"
                  class="text-green-900 underline text-sm font-normal text-gray-800 hover:text-green-700"
                >
                  {{ item.name }}
                </a>
              </td>
              <td class="px-3 py-4">
                {{ item.developer }}
              </td>
              <td class="px-3 py-4 text-right">
                <span v-if="item.price">{{ formatPrice(item.price) }}</span>
                <span v-if="!item.price" class="text-gray-400">N/A</span>
              </td>
              <td class="px-3 py-4">
                {{ item.enclosure }}
              </td>
              <td class="px-3 py-4 whitespace-wrap">
                {{ item.type }}
              </td>
              <td class="px-3 py-4 text-right whitespace-nowrap">
                <span v-if="item.f3">{{ item.f3 }} Hz</span>
              </td>
              <td class="px-3 py-4 text-right">
                {{ item.sensitivity }} dB
              </td>
              <td class="px-3 py-4">
                {{ item.specialty }}
              </td>
              <td class="px-3 py-4 text-right">
                {{ item.height }}
              </td>
              <td class="px-3 py-4 text-right">
                {{ item.width }}
              </td>
              <td class="px-3 py-4 text-right">
                {{ item.depth }}
              </td>
              <td class="px-3 py-4 text-right">
                {{ calculateVolume(item) }} L
              </td>
              <td class="px-1 py-2 text-left text-sm font-normal">
                <button
                  @click="editItem(item)"
                  class="px-3 py-1 text-sm font-medium text-green-900 border-gray-500 rounded-md shadow-sm cursor-pointer hover:bg-gray-100"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Edit Dialog -->
      <div
        v-if="showEditDialog"
        class="fixed inset-0 flex items-center justify-center p-4 bg-gray-50"
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
                F₃
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
                Sensitivity
              </label>
              <input
                type="number"
                v-model="editingItem.sensitivity"
                class="focus:outline-0 text-sm w-full border-b-1 border-gray-300 py-1"
                @input="trackChange('sensitivity', editingItem.sensitivity)"
              />
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
                >Dimensions (H×W×D):</label
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
    </div>
  </div>
</template>
