<script>

export default {
  name: "CompareWidget",
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  mounted() {},
  unmounted() {},
  data() {
    return {
        comparing: false
    };
  },
  watch: {},
  methods: {
    removeItem(item) {
        this.items.splice(this.items.indexOf(item), 1);
        if(this.comparing == true && this.items.length == 0) {
            this.stopComparing();
        }
    },
    clearItems() { 
        this.items.splice(0, this.items.length); 
        if(this.comparing == true) {
            this.stopComparing()
        }
    },
    submit() {
        this.comparing = true;
        this.$emit('startCompareItems', this.items);
    },
    stopComparing() {
        this.comparing = false;
        this.$emit('endCompareItems');
    }
  }
}
</script>
<template>
    <div v-if="items.length" class="fixed bottom-0 right-15 my-6 py-3 px-3 w-60 bg-white shadow-xl">
        <div v-if="true">
            <div class="grid grid-cols-1 divide-y divide-gray-200">
                <div v-for="item in items" class="flex py-1">
                    <div class="flex-auto text-nowrap overflow-hidden text-ellipsis text-gray-600">{{ item.name }}</div>
                    <button @click="removeItem(item)"
                        class="p-1 text-gray-600 rounded-md cursor-pointer hover:bg-gray-100 hover:text-green-700"
                        title="Compare">
                        <svg class="h-4 w-4" fill="currentColor">
                        <use xlink:href="#trash-icon" />
                        </svg>
                    </button>
                </div>
            </div>
            <div class="flex mt-6 justify-end space-x-3 text-sm">
                <button @click="clearItems" class="px-3 py-1 cursor-pointer bg-gray-200 border-gray-500 rounded-md text-gray-500 shadow-sm hover:bg-gray-100">
                    Clear
                </button>
                <button v-if="!comparing" @click="submit" class="px-3 py-1 text-sm font-medium text-green-900 bg-green-200 border-gray-500 rounded-md shadow-md cursor-pointer hover:bg-gray-100">
                    Compare
                </button>
                <button v-if="comparing" @click="stopComparing" class="px-3 py-1 text-sm font-medium text-green-900 bg-green-200 border-gray-500 rounded-md shadow-md cursor-pointer hover:bg-gray-100">
                    Return
                </button>
            </div>
        </div>
    </div>
</template>