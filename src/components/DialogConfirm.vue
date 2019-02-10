<template>
  <v-dialog
    v-model="value"
    max-width="300"
  >
    <v-card>
      <v-card-title class="headline">{{$t('alert.confirm')}}</v-card-title>
      <v-card-text>
        {{$t('alert.confirm_delete')}}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red darken-1"
          flat="flat"
          @click="cancel()"
        >
          {{$t('alert.donot')}}
        </v-btn>
        <v-btn
          color="green darken-1"
          flat="flat"
          @click="accept()"
        >
          {{$t('alert.accept')}}
        </v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default{
  name: 'DialogConfirm',
  props: ['value'],
  methods: {
    accept () {
      this.$emit('input', true)
    },
    cancel () {
      this.$emit('input', false)
    }
  }
}
</script>
