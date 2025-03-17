<template>
  <div class="fixed inset-0 flex items-center justify-center p-4 bg-gray-50 bg-opacity-75 z-10" v-if="visible">
    <div class="bg-white text-green-900 rounded-md shadow-lg max-w-md w-full p-6">
      <h2 class="text-md font-bold uppercase mb-4">Imprint</h2>
      <p class="text-gray-600 text-xs whitespace-pre-line">
        <pre>
Keilerkonzept UG (haftungsbeschränkt)
Breisacher Straße 3
81667 München

+49 (0) 174 146 84 34
kontakt@keilerkonzept.com

Registergericht: München
Registernummer: HRB 250047
        </pre>
      </p>
      <button @click="closeDialog" class="px-4 py-2 cursor-pointer bg-gray-200 border-gray-500 rounded-md text-gray-500 shadow-sm hover:bg-gray-100">
        Close
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImprintDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    }
  }
}
</script>
