<template>
  <v-card
    v-show="showChat"
    class="text-xs-center fixed-chat"
  >
    <v-card-title>
      {{ title }}
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="showContent = !showContent"
      >
        <v-icon>{{ showContent ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click="invokeChat(false)"
      >
        <v-icon>{{ 'mdi-close' }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-expand-transition>
      <div v-show="showContent">
        <v-card-text>
          <v-card
            ref="chatBox"
            height="300"
            class="overflow-auto"
          >
            <div
              v-for="(msg, index) in chatInfo.messages"
              :key="index"
            >
              <v-card
                width="100%"
                class="my-1"
              >
                <v-card-text class="d-flex">
                  <v-tooltip bottom>
                    <template #activator="{ on, attrs }">
                      <v-avatar
                        v-on="on"
                        v-bind="attrs"
                        class="mr-2"
                        size="30"
                      >
                        <v-img
                          :src="`https://avatars.dicebear.com/api/bottts/${msg.clientId === chatInfo.currUser.id ? chatInfo.currUser.email : chatInfo.toUser.email}.svg`"
                          alt=""
                        />
                      </v-avatar>
                    </template>
                    {{
                      msg.clientId === chatInfo.currUser.id
                        ? chatInfo.currUser.username
                        : chatInfo.toUser.username,
                    }}
                  </v-tooltip>
                  <div>
                    <div class="grey--text caption">
                      {{ msg.createdAt || '-' }}
                    </div>
                    <div class="heading caption">
                      {{ msg.content }}
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>

          </v-card>
        </v-card-text>
        <v-card-actions>
          <v-text-field
            label="Submit"
            v-model="textMessage"
          ></v-text-field>
          <v-btn
            icon
            @click="sendMessage"
          >
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </v-card-actions>
      </div>
    </v-expand-transition>
  </v-card>
</template>
<script>
export default {
  props: {
    chatInfo: {
      type: Object,
      defaukt: () => {},
    },
    newChat: {
      type: Boolean,
      default: false,
    },
    showChat: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    textMessage: '',
    showContent: true,
  }),
  computed: {
    title() {
      return this.newChat ? 'Start a new chat' : this.chatInfo.toUser.username;
    },
  },
  methods: {
    sendMessage() {
      const message = this.textMessage;
      this.textMessage = '';
      this.$emit('send-message', message);
    },
    invokeChat() {
      this.textMessage = '';
      this.$emit('close-chat');
    },
    scrollToBottom() {
      const { chatBox } = this.$refs;
      chatBox.$el.scrollTop = chatBox.$el.scrollHeight;
    },
  },
};
</script>
