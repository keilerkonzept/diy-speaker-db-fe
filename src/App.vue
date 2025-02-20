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
      ],
      availableRanges: ["Full Range", "Top", "Subwoofer"],
      availableSpecialties: ["Koax", "Passive Membrane", "Broadband", "AMT"],
      filters: {
        name: "",
        price: null,
        enclosures: [],
        ranges: [],
        specialties: [],
        height: null,
        width: null,
        depth: null,
        volume: null,
        developer: "",
        f3: null,
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
        range: false,
      },
      selectedEnclosure: "",
      selectedRange: "",
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
            range: item[4],
            f3: item[5].length > 0 ? parseFloat(item[5]) : null,
            sensitivity: item[6].length > 0 ? parseFloat(item[6]) : null,
            specialty: item[7],
            height: item[8].length > 0 ? parseFloat(item[8]) : null,
            width: item[9].length > 0 ? parseFloat(item[9]) : null,
            depth: item[10].length > 0 ? parseFloat(item[10]) : null,
            url: item[11],
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
        const rangeMatch =
          this.filters.ranges.length === 0 ||
          this.filters.ranges.includes(item.range);
        const specialtyMatch =
          this.filters.specialties.length === 0 ||
          this.filters.specialties.includes(item.specialty);

        const priceMatch =
          !this.filters.price || item.price < this.filters.price;
        const heightMatch =
          !this.filters.height || item.height < this.filters.height;
        const widthMatch =
          !this.filters.width || item.width < this.filters.width;
        const depthMatch =
          !this.filters.depth || item.depth < this.filters.depth;

        const volumeInLiters =
          (item.height * item.width * item.depth) / 1000000;
        const volumeMatch =
          !this.filters.volume || volumeInLiters < this.filters.volume;

        const f3Match = !this.filters.f3 || item.f3 < this.filters.f3;

        return (
          nameMatch &&
          priceMatch &&
          enclosureMatch &&
          rangeMatch &&
          specialtyMatch &&
          heightMatch &&
          widthMatch &&
          depthMatch &&
          volumeMatch &&
          developerMatch &&
          f3Match
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
      } else if (filterType === "ranges") {
        this.selectedRange = "";
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
      if (["enclosures", "ranges", "specialties"].includes(filterName)) {
        this.filters[filterName] = [];
        this[
          `selected${
            filterName.slice(0, -1).charAt(0).toUpperCase() +
            filterName.slice(1, -1)
          }`
        ] = "";
      } else if (
        ["price", "height", "width", "depth", "volume", "f3"].includes(
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
        range: "",
        f3: null,
        specialty: "",
        height: null,
        width: null,
        depth: null,
        url: "",
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
          range: false,
        };
      }
    },

    validateForm() {
      if (!this.isNewEntry) return true;

      this.formErrors = {
        name: !this.editingItem.name,
        url: !this.editingItem.url,
        enclosure: !this.editingItem.enclosure,
        range: !this.editingItem.range,
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
  <div class="overflow-scroll">
    <!-- Header -->
    <div
      class="sticky left-0 text-xl w-full bg-black text-white font-black mb-4 py-2 px-4"
    >
      <div class="flex items-center justify-between">
        <a href="/"> DIY Speaker DB </a>
        <a href="https://keilerkonzept.com">
          <svg
            class="size-5 color-blue-200 mr-2 inline-block"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 124.51 104.87"
            fill-rule="evenodd"
            clip-rule="evenodd"
            stroke-linejoin="round"
            stroke-miterlimit="1.414"
          >
            <path
              fill-rule="nonzero"
              d="M41.404,23.741 C41.186,23.74 40.969,23.768 40.758,23.823 C16.619,30.18 0.002,46.714 0.002,65.818 C0.002,72.678 2.197,79.433 6.326,85.509 C6.491,85.752 6.698,85.964 6.937,86.136 C12.685,90.258 22.877,94.118 31.031,96.766 C39.775,101.998 50.832,104.866 62.256,104.866 C73.682,104.866 84.74,101.998 93.485,96.766 C101.639,94.117 111.831,90.257 117.578,86.136 C117.816,85.965 118.022,85.753 118.187,85.511 C122.316,79.435 124.512,72.679 124.511,65.818 C124.511,46.714 107.896,30.181 83.758,23.823 C83.55,23.769 83.336,23.742 83.121,23.742 L83.119,23.741 C82.016,23.742 81.043,24.466 80.726,25.522 C80.409,26.579 80.822,27.719 81.742,28.327 C88.122,32.54 93.195,38.675 96.502,45.881 C87.408,39.434 75.094,35.815 62.257,35.815 C62.186,35.815 62.114,35.815 62.043,35.815 C49.28,35.855 37.054,39.472 28.012,45.881 C31.32,38.676 36.393,32.54 42.773,28.327 C43.692,27.72 44.106,26.583 43.791,25.527 C43.476,24.472 42.508,23.746 41.406,23.741 L41.404,23.741 Z M30.26,33.03 C25.534,38.735 22.097,45.6 20.25,53.058 C15.982,58.311 13.734,64.272 13.734,70.34 C13.734,76.222 15.846,82.006 19.87,87.145 C16,85.545 12.538,83.885 10.219,82.286 C6.772,77.064 5,71.471 5,65.817 C5,52.694 14.592,40.412 30.259,33.03 L30.26,33.03 Z M94.256,33.032 C109.922,40.415 119.512,52.694 119.512,65.817 C119.512,71.47 117.741,77.062 114.295,82.283 C111.975,83.882 108.514,85.544 104.644,87.144 C108.667,82.006 110.779,76.221 110.779,70.339 C110.779,64.271 108.531,58.309 104.261,53.056 C102.415,45.6 98.98,38.735 94.256,33.032 Z M44.984,53.799 C50.591,53.8 55.136,61.204 55.136,70.338 C55.136,79.471 50.591,86.876 44.984,86.876 C39.376,86.876 34.831,79.472 34.831,70.338 C34.831,61.204 39.376,53.799 44.984,53.799 Z M79.538,53.799 C85.145,53.8 89.69,61.204 89.69,70.338 C89.69,79.471 85.145,86.876 79.538,86.876 C73.931,86.876 69.385,79.472 69.385,70.338 C69.385,61.204 73.931,53.799 79.538,53.799 Z M43.014,7.7 C43.014,10.653 40.412,13.048 37.202,13.048 C33.992,13.048 31.39,10.653 31.39,7.7 C31.39,4.747 33.992,2.353 37.202,2.353 C40.412,2.353 43.014,4.747 43.014,7.7 Z M87,15.625 C82.787,15.625 79.375,12.213 79.375,8 C79.375,3.787 82.787,0.375 87,0.375 C91.213,0.375 94.625,3.787 94.625,8 C94.625,12.213 91.213,15.625 87,15.625 Z M37.13,15.935 C32.917,15.935 29.505,12.523 29.505,8.31 C29.505,4.097 32.917,0.685 37.13,0.685 C41.343,0.685 44.755,4.097 44.755,8.31 C44.755,12.523 41.343,15.935 37.13,15.935 Z"
            ></path>
          </svg>
        </a>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container min-w-full mx-auto px-4">
      <!-- New Entry Button -->
      <button
        @click="createNewEntry"
        class="mb-6 text-sm border-1 cursor-pointer border-gray-500 hover:bg-black hover:text-white text-black px-2 py-1 rounded-md transition-colors duration-200"
      >
        Submit New Entry
      </button>

      <!-- Table -->
      <div
        class="h-[100vh] relative min-w-full w-fit rounded-md border border-gray-100 bg-gray-100"
      >
        <table class="min-w-full sm:table-fixed divide-y divide-gray-200">
          <thead class="sticky top-0 bg-gray-100">
            <!-- Header Row -->
            <tr class="text-xs">
              <th
                scope="col"
                class="min-w-[150pt] w-[250pt] px-3 py-3 text-left font-medium text-black uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                class="min-w-[100pt] w-[200pt] px-3 py-3 text-left font-medium text-black uppercase tracking-wider"
              >
                Developer
              </th>
              <th
                scope="col"
                class="min-w-[70pt] w-[70pt] px-3 py-3 text-left font-medium text-black uppercase tracking-wider"
              >
                Price / pair
              </th>
              <th
                scope="col"
                class="w-[100pt] px-3 py-3 text-left font-medium text-black uppercase tracking-wider"
              >
                Enclosure
              </th>
              <th
                scope="col"
                class="min-w-[60pt] w-[80pt] px-3 py-3 text-left font-medium text-black uppercase tracking-wider"
              >
                Range
              </th>
              <th
                scope="col"
                class="min-w-[60pt] w-[60pt] px-3 py-3 text-left font-medium text-black uppercase tracking-wider"
              >
                F₃
              </th>
              <th
                scope="col"
                class="w-[100pt] px-3 py-3 text-left font-medium text-black uppercase tracking-wider"
              >
                Specialty
              </th>
              <th
                scope="col"
                class="min-w-[20pt] w-[20pt] px-3 py-3 text-left font-medium text-black uppercase tracking-wider"
              >
                Height
              </th>
              <th
                scope="col"
                class="min-w-[20pt] w-[20pt] px-3 py-3 text-left font-medium text-black uppercase tracking-wider"
              >
                Width
              </th>
              <th
                scope="col"
                class="min-w-[20pt] w-[20pt] px-3 py-3 text-left font-medium text-black uppercase tracking-wider"
              >
                Depth
              </th>
              <th
                scope="col"
                class="w-[30pt] px-3 py-3 text-left font-medium text-black uppercase tracking-wider"
              >
                Volume (L)
              </th>
              <th
                scope="col"
                class="min-w-[40pt] px-3 py-3 text-left font-medium text-black uppercase tracking-wider"
              ></th>
            </tr>

            <!-- Filter Row -->
            <tr class="bg-gray-100 align-baseline text-sm">
              <th class="px-3 py-3">
                <input
                  type="text"
                  v-model="filters.name"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('name')"
                  class="w-full font-normal rounded-md px-2 py-1 bg-white border-gray-300 text-gray-900 focus:border-green-500"
                  placeholder="Filter by name"
                />
              </th>
              <th class="px-3 py-3">
                <input
                  type="text"
                  v-model="filters.developer"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('developer')"
                  class="w-full font-normal rounded-md px-2 py-1 bg-white border-gray-300 text-gray-900 focus:border-green-500"
                  placeholder="Filter by developer"
                />
              </th>
              <th class="px-3 py-3">
                <input
                  type="number"
                  v-model.number="filters.price"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('price')"
                  class="w-full font-normal rounded-md px-2 py-1 text-gray-900 bg-white border-gray-300 focus:border-green-500"
                  placeholder="< €"
                />
              </th>
              <th class="px-3 py-3">
                <div class="relative">
                  <select
                    v-model="selectedEnclosure"
                    @change="addFilter('enclosures', selectedEnclosure)"
                    class="w-full font-normal text-gray-500 rounded-md mt-1 px-2 py-1 bg-white border-gray-300 focus:border-green-500"
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
                      class="inline-flex items-center pl-2 py-1 rounded-md text-xs bg-gray-300 text-gray-900"
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
                    v-model="selectedRange"
                    @change="addFilter('ranges', selectedRange)"
                    class="w-full font-normal text-gray-500 rounded-md mt-1 px-2 py-1 bg-white border-gray-300 focus:border-green-500"
                  >
                    <option value="">Select...</option>
                    <option
                      v-for="range in availableRanges"
                      :key="range"
                      :value="range"
                    >
                      {{ range }}
                    </option>
                  </select>
                  <div class="mt-2 flex flex-wrap gap-2 font-normal">
                    <span
                      v-for="item in filters.ranges"
                      :key="item"
                      class="inline-flex items-center pl-2 py-1 rounded-md text-xs bg-gray-300 text-gray-900"
                    >
                      {{ item }}
                      <button
                        @click="removeFilter('ranges', item)"
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
                  class="w-full font-normal text-gray-900 rounded-md px-2 py-1 bg-white border-gray-300 focus:border-green-500"
                  placeholder="> F₃"
                />
              </th>
              <th class="px-3 py-3">
                <div class="relative">
                  <select
                    v-model="selectedSpecialty"
                    @change="addFilter('specialties', selectedSpecialty)"
                    class="w-full font-normal text-gray-500 rounded-md mt-1 px-2 py-1 bg-white border-gray-300 focus:border-green-500"
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
                      class="inline-flex items-center pl-2 py-1 rounded-md text-xs bg-gray-300 text-gray-900"
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
                  class="w-full font-normal rounded-md px-2 py-1 bg-white text-gray-900 border-gray-300 focus:border-green-500"
                  placeholder="< H"
                />
              </th>
              <th class="px-3 py-3">
                <input
                  type="number"
                  v-model.number="filters.width"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('width')"
                  class="w-full font-normal rounded-md px-2 py-1 bg-white text-gray-900 border-gray-300 focus:border-green-500"
                  placeholder="< W"
                />
              </th>
              <th class="px-3 py-3">
                <input
                  type="number"
                  v-model.number="filters.depth"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('depth')"
                  class="w-full font-normal rounded-md px-2 py-1 bg-white text-gray-900 border-gray-300 focus:border-green-500"
                  placeholder="< D"
                />
              </th>
              <th class="px-3 py-3">
                <input
                  type="number"
                  v-model.number="filters.volume"
                  @input="applyFilters"
                  @keyup.esc="clearFilter('volume')"
                  class="w-full font-normal rounded-md px-2 py-1 bg-white text-gray-900 border-gray-300 focus:border-green-500"
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
              <td class="px-3 py-4">
                <a
                  :href="item.url"
                  target="_blank"
                  class="text-black underline text-sm font-normal text-gray-800"
                >
                  {{ item.name }}
                </a>
              </td>
              <td class="px-3 py-4">
                {{ item.developer }}
              </td>
              <td class="px-3 py-4 text-right">
                {{ formatPrice(item.price) }}
              </td>
              <td class="px-3 py-4">
                {{ item.enclosure }}
              </td>
              <td class="px-3 py-4 whitespace-wrap">
                {{ item.range }}
              </td>
              <td class="px-3 py-4 text-right whitespace-nowrap">
                <span v-if="item.f3">{{ item.f3 }} Hz</span>
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
              <td class="px-1 py-2 text-right text-sm font-normal">
                <button
                  @click="editItem(item)"
                  class="border-1 border-gray-500 hover:bg-black cursor-pointer hover:text-white text-black px-2 py-1 rounded-md transition-colors duration-200 font-normal"
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
        class="fixed inset-0 flex items-center justify-center p-4"
        style="background-color: rgb(0, 0, 0, 0.5)"
      >
        <div class="bg-white rounded-md max-w-2xl w-full p-6">
          <h2 class="text-xl font-bold mb-4">
            {{ isNewEntry ? "Submit New Entry" : "Edit Entry" }}
          </h2>

          <!-- Form Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Name Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
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
              <label class="block text-sm font-medium text-gray-700 mb-1">
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
              <label class="block text-sm font-medium text-gray-700 mb-1">
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
              <label class="block text-sm font-medium text-gray-700 mb-1">
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
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Enclosure <span class="text-red-500">*</span>
              </label>
              <select
                v-model="editingItem.enclosure"
                @change="trackChange('enclosure', editingItem.enclosure)"
                class="text-sm w-full bg-gray-200 rounded-md p-2"
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
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Range <span class="text-red-500">*</span>
              </label>
              <select
                v-model="editingItem.range"
                @change="trackChange('range', editingItem.range)"
                class="text-sm w-full bg-gray-200 rounded-md p-2"
              >
                <option value="">Select range...</option>
                <option
                  v-for="range in availableRanges"
                  :key="range"
                  :value="range"
                >
                  {{ range }}
                </option>
              </select>
              <span
                v-if="isNewEntry && formErrors.range"
                class="text-red-500 text-sm"
                >Range is required</span
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Specialty
              </label>
              <select
                v-model="editingItem.speciality"
                @change="trackChange('speciality', editingItem.speciality)"
                class="text-sm w-full bg-gray-200 rounded-md p-2"
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
              <label class="block text-sm font-medium text-gray-700 mb-2"
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
              <label class="block text-sm font-medium text-gray-700 mb-1">
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
          </div>

          <!-- Dialog Buttons -->
          <div class="mt-6 flex justify-end space-x-3 text-sm">
            <button
              @click="closeEditDialog"
              class="px-3 py-1 cursor-pointer bg-gray-200 border-gray-500 rounded-md text-gray-500 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              @click="submitEdit"
              class="px-3 py-1 bg-black border-1 border-black text-gray-300 hover:text-white cursor-pointer rounded-md"
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
