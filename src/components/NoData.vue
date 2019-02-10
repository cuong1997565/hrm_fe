<template>
  <v-flex d-flex fill-height justify-center align-center class="white">
    <div class="text-center">
      <div class="red--text">Không có dữ liệu phù hợp</div>
      <v-btn color="primary" @click="newUrl && $router.push(newUrl)"><v-icon dark left>add</v-icon> Thêm mới ngay</v-btn>
    </div>
  </v-flex>
</template>
<script>
export default{
  name: 'NoData',
  props: ['newUrl']
}
</script>
