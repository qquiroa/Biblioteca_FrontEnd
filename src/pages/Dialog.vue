<template>
  <q-dialog
    v-model="active"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="my-card" style="padding: 1%">
      <q-card-section>
        <div class="text-h4">
          <center>
            <q-icon :name="icon" size="xl" :color="color" />
            <br />{{ title }}
          </center>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ body }}
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="Ok" @click="close" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "Dialog",
  props: {
    active: Boolean,
    title: String,
    body: String,
    icon: String,
    color: String,
    close: Function
  },
  methods: {
    close_popup(){
      this.active = false
    }
  }
};
</script>
