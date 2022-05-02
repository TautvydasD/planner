<template>
  <v-container>
    <slide-table
      :instances="coaches"
      title="Coaches"
      :loaded="loaded"
    >
      <template #header>
        <card-modal
          v-if="loaded && coaches.length > 5"
        >
          <template #content="{ on, attrs }">
            <div class="d-flex align-center">
              <v-btn
                v-bind="attrs"
                v-on="on"
                text
              >
                Show all
              </v-btn>
            </div>
          </template>
        </card-modal>
      </template>
      <template #default="{ item }">
        <v-flex xs2>
          <v-card class="text-xs-center ma-4">
            <v-card-title class="justify-center">
              <v-avatar>
                <v-img :src="`https://avatars.dicebear.com/api/bottts/${item.email}.svg`" alt="" />
              </v-avatar>
            </v-card-title>
            <v-card-title class="justify-center">
              <div class="subheading">
                {{ item.username }}
              </div>
            </v-card-title>
            <v-card-text>
              <div>
                {{ item.description || 'Some coaches need to write abou themselves more' }}
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                v-if="userData.username !== item.username"
                text
                color="grey"
              >
                <v-icon small>
                  mdi-message
                </v-icon>
                <span>Message</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </template>
    </slide-table>
    <card-table
      :instances="rooms"
      :loaded="loaded"
      title="Chats"
    >
      <template #default="{ item }">
        <v-card class="text-xs-center ma-4">
          <v-card-title class="justify-center">
            <v-badge
              bordered
              bottom
              :color="item.connected ? 'green' : 'grey'"
              dot
              offset-x="10"
              offset-y="10"
            >
              <v-avatar>
                <v-img :src="`https://avatars.dicebear.com/api/bottts/${item.toUser.email}.svg`" alt="" />
              </v-avatar>
            </v-badge>
          </v-card-title>
          <v-card-title class="justify-center">
            <div class="subheading">
              {{ item.toUser.username }}
            </div>
          </v-card-title>
          <v-card-text>
            {{ getLatestText(item) }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              color="grey"
              @click="openExistantChat(item)"
            >
              <v-icon small>
                mdi-message
              </v-icon>
              <span>Message</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </card-table>
    <chat
      ref="chat"
      :chat-info="currentChat"
      :show-chat="showChatModal"
      @send-message="sendMessage"
      @close-chat="closeChat"
    />
  </v-container>
</template>

<script>
import CardTable from '../components/CardTable.vue';
import SlideTable from '../components/SlideTable.vue';
import Chat from '../components/Chat.vue';

import socket from '../services/socket';
import user from '../services/user';

export default {
  components: {
    CardTable,
    Chat,
    SlideTable,
  },
  data() {
    return {
      showContent: true,
      showChatModal: false,
      coaches: [],
      currentChat: {
        toUser: {},
        currUser: {},
        messages: [],
        showChat: false,
      },
      userData: {},
      users: [],
      rooms: [],
      loaded: false,
    };
  },
  created() {
    this.loadData();
  },
  destroyed() {
    socket.off('connect');
    socket.off('disconnect');
    socket.off('connect_error');
    socket.off('users');
    socket.off('user_connected');
    socket.off('user_disconnected');
    socket.off('private_message');
  },
  methods: {
    setupSocket() {
      socket.on('connect', () => {
        this.users = this.users.map((usr) => {
          const conn = usr;
          if (conn.self) {
            conn.connected = true;
          }
          return conn;
        });
      });
      socket.on('disconnect', () => {
        this.users = this.users.map((usr) => {
          const conn = usr;
          if (conn.self) {
            conn.connected = false;
          }
          return conn;
        });
      });
      socket.on('connect_error', (err) => {
        if (err.message === 'User does not exist') {
          return false;
        }
        return true;
      });
      socket.on('users', (users) => {
        this.users = users.map(this.setupUserConnection)
          .sort((a, b) => {
            if (a.self) return -1;
            if (b.self) return 1;
            if (a.user.email < b.user.email) return -1;
            return a.user.email > b.user.email ? 1 : 0;
          });
        this.rooms = this.rooms.map((r) => {
          const newR = r;
          newR.connected = this.users.some((u) => u.user.id === newR.toUser.id);
          return newR;
        });
      });
      socket.on('user_connected', (newUser) => {
        this.users = this.users.filter((o) => o.user.username !== newUser.user.username);
        this.users.push(this.setupUserConnection(newUser));
        const roomIdx = this.rooms.findIndex((r) => newUser.user.id === r.toUser.id);
        if (roomIdx !== -1) {
          const room = this.rooms[roomIdx];
          room.connected = true;
          this.$set(this.rooms, roomIdx, room);
        }
      });
      socket.on('user_disconnected', (id) => {
        this.users = this.users.map((usr) => {
          const conn = usr;
          if (conn.userId === id) {
            conn.connected = false;
          }
          return conn;
        });
        const oldUser = this.users.find((u) => u.userId === id);
        const roomIdx = this.rooms.findIndex((r) => oldUser.user.id === r.toUser.id);
        if (roomIdx !== -1) {
          const room = this.rooms[roomIdx];
          room.connected = false;
          this.$set(this.rooms, roomIdx, room);
        }
      });
      socket.on('private_message', ({ content, roomId, from }) => {
        for (let i = 0; i < this.users.length; i += 1) {
          if (this.users[i].userId === from) {
            const roomIdx = this.rooms.findIndex((r) => r.id === roomId);
            const msgs = this.rooms[roomIdx].messages;
            msgs.push(content);
            this.$set(this.rooms[roomIdx], 'messages', msgs);
            if (this.users[i].user.id !== content.cliendId) {
              this.currentChat = { ...this.rooms[roomIdx] };
              this.showChatModal = true;
            }
            this.$refs.chat.scrollToBottom();
            break;
          }
        }
      });
      socket.on('new_chat', () => {

      });
      socket.auth = { user: this.userData };
      socket.connect();
    },
    setupUserConnection(userData) {
      const usr = userData;
      usr.self = userData.userId === socket.id;
      usr.connected = true;
      usr.messages = [];
      usr.hasNewMessages = false;
      return usr;
    },
    loadData() {
      return Promise.all([
        user.getCoaches(),
        user.getRooms(),
        user.getProfile(),
      ]).then(([{ data: coachData }, { data: roomData }, { data: userData }]) => {
        this.coaches = coachData.coaches;
        this.userData = userData;
        this.rooms = roomData.rooms;
        this.setupSocket();
        this.loaded = true;
      }).catch(() => {
        console.log('Failed to get all data');
      });
    },
    sendMessage(text) {
      if (!text) return 1;
      const targetUser = this.users.find((o) => o.user.id === this.currentChat.toUser.id);
      const form = {
        roomId: this.currentChat.id,
        currUserId: this.currentChat.currUser.id,
        toClientId: this.currentChat.toUser.id,
        content: text,
        fromSelf: true,
      };
      socket.emit('private_message', {
        content: form,
        to: targetUser?.userId,
      });
      return 0;
    },
    openExistantChat(usr) {
      this.currentChat = { ...usr };
      this.showChatModal = true;
      this.$refs.chat.scrollToBottom();
    },
    closeChat() {
      this.showChatModal = false;
    },
    getLatestText(item) {
      if (item.messages && item.messages.length > 0) {
        const { clientId, content } = item.messages.at(-1);
        const name = item.toUser.id === clientId
          ? item.toUser.username
          : item.currUser.username;
        return `${name}: ${content}`;
      }
      return 'No messages available';
    },
  },
};
</script>

<style scoped>
.fixed-chat {
  right: 0;
  position: fixed;
  z-index: 100;
  bottom: 0;
  width: 420px;
  border-bottom-right-radius: 0%;
  border-bottom-left-radius: 0%;
}
</style>
