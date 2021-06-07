<template>
  <v-container fluid>
    <!-- {{ me }} -->
    <v-row v-if="me">
      <v-col cols="4">
        <v-card>
          <v-img height="250" src="https://picsum.photos/374/374" />

          <!-- <v-btn
            fab
            color="white"
            class="edit-button"
            small
            @click="editMode = !editMode"
          >
            <v-icon color="black"> mdi-pencil </v-icon>
          </v-btn>

          <v-btn
            v-if="!hideUserActions"
            fab
            class="avatar-button"
            :loading="loading"
            small
            @click="launchSelector"
          >
            <v-icon color="black"> mdi-camera </v-icon>
          </v-btn> -->

          <input
            ref="uploader"
            class="d-none"
            type="file"
            accept="image/*"
            @change="onFileChanged"
          />

          <v-row class="avatar-wrapper ml-0 mr-0">
            <v-col class="text-center">
              <v-avatar size="150">
                <img :src="user.picture" :alt="user.name" />
              </v-avatar>
            </v-col>
          </v-row>

          <v-row v-if="!editMode" class="info-wrapper px-12">
            <v-col class="text-center px-5">
              <p class="text-h4 mb-0">{{ user.name }}</p>
              <p class="text-caption mb-1">{{ user.email }}</p>
              <p v-if="user.role" class="text-subtitle-1 mb-2">
                {{ user.role }}
              </p>
              <p v-else class="text-caption">Just another awesome user 🚀</p>
            </v-col>
          </v-row>
          <v-row v-else class="info-wrapper px-12">
            <v-col class="text-center px-5">
              <v-text-field v-model="user.name" label="Name" />
            </v-col>
          </v-row>

          <div class="action-buttons-wrapper px-12 pb-6">
            <v-row>
              <v-col v-if="!editMode" class="text-center">
                <v-tooltip v-if="!hideUserActions" top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="requestPasswordChange"
                      fab
                      color="black"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon color="white"> mdi-lock-reset </v-icon>
                    </v-btn>
                  </template>
                  <span>Reset password</span>
                </v-tooltip>

                <v-snackbar v-model="resetSnackbar">
                  An email has been sent with instructions to change the
                  password.
                  <template v-slot:action="{ attrs }">
                    <v-btn
                      color="secondary"
                      text
                      v-bind="attrs"
                      @click="resetSnackbar = false"
                    >
                      Close
                    </v-btn>
                  </template>
                </v-snackbar>
              </v-col>
              <v-col v-else class="text-center">
                <v-btn color="green" dark @click="update">
                  <v-icon left> mdi-check </v-icon>
                  Save
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>

      <v-col>
        <v-card class="px-4 fill-height">
          <v-card-title>Edit Profile</v-card-title>
          <v-row>
            <v-col>
              Name <v-text-field outlined v-model="user.name"></v-text-field>
            </v-col>
            <v-col>
              Picture
              <v-text-field outlined v-model="user.picture"></v-text-field>
            </v-col>
            <v-col>
              Email <v-text-field outlined v-model="user.email"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              Twitter
              <v-text-field outlined v-model="user.twitter"></v-text-field>
            </v-col>
            <v-col>
              Facebook
              <v-text-field outlined v-model="user.facebook"></v-text-field>
            </v-col>
            <v-col>
              Instagram
              <v-text-field outlined v-model="user.instagram"></v-text-field>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else justify="center" align="center">
      <v-card> Please login </v-card>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    user() {
      return this.me || {};
    },
    ...mapGetters({me: 'SAuth/me',}),
  },
  methods: {
    async requestPasswordChange() {
      // await axios.post('/api/auth/request-password-change')
      // this.resetSnackbar = true
    },

    async uploadPicture(formPicture) {
      if (!formPicture) {
        return;
      }

      this.loading = true;
      try {
        const formData = new FormData();
        formData.append("file", formPicture);

        await axios.post("/api/users/current/avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.$store.dispatch("account/updateMe");
      } finally {
        this.loading = false;
      }
    },

    launchSelector() {
      this.loading = true;
      window.addEventListener(
        "focus",
        () => {
          this.loading = false;
        },
        { once: true }
      );

      this.uploader.click();
    },

    onFileChanged(e) {
      const selectedFile = e.target.files[0];
      if (!selectedFile) {
        return;
      }

      if (selectedFile.size > this.maxFileSize) {
        alert("File is too large");
        return;
      }

      this.uploadPicture(selectedFile);
    },
  },
  data() {
    return {
      hideUserActions: false,
    };
  },
};
</script>


<style lang="scss" scoped>
.avatar-wrapper {
  position: absolute;
  width: 100%;
  transform: translateY(-50%);
}
.info-wrapper {
  margin-top: calc(150px / 2);
}
.edit-button {
  position: absolute;
  top: 20px;
  right: 20px;
}
.avatar-button {
  position: absolute;
  top: 20px;
  right: 80px;
}
</style>