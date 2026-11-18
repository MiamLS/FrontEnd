const MusicRecordComponent = {
  props: {
    authToken: { type: String, default: "" },
    isAuthenticated: { type: Boolean, default: false },
  },
  template: `
    <section class="music-library" aria-labelledby="page-title">
      <header class="page-header">
        <div class="header-content">
          <div><p class="eyebrow">DR MUSIKARKIV <span class="archive-dot"></span></p><h1 id="page-title">DR's musiklager</h1><p class="page-description">Et digitalt arkiv over musikplader fra DR's samling.</p></div>
          <button v-if="isAuthenticated" class="secondary-button logout-button" type="button" @click="$emit('logout')">Log ud</button>
          <button v-else class="login-button" type="button" @click="$emit('login')">Log ind</button>
        </div>
        <button v-if="isAuthenticated" class="primary-button" type="button" :aria-expanded="showAddForm" @click="toggleAddForm">{{ showAddForm ? 'Cancel' : 'Add music record' }}</button>
        <p v-if="successMessage" class="form-message form-success" role="status">{{ successMessage }}</p>
      </header>
      <div class="search-container"><input v-model="searchTitle" type="text" placeholder="Søg på titel"><input v-model="searchArtist" type="text" placeholder="Søg på kunstner"><button type="button" @click="fetchMusicRecords">Søg</button></div>
      <form v-if="isAuthenticated && showAddForm" class="record-form" @submit.prevent="addMusicRecord">
        <h2>Add a music record</h2><div class="form-fields">
          <label>Title <input v-model.trim="newMusicRecord.title" type="text" required></label><label>Artist <input v-model.trim="newMusicRecord.artist" type="text" required></label>
          <label>Duration <input v-model.trim="newMusicRecord.duration" type="text" placeholder="e.g. 3:45" required></label><label>Year <input v-model.number="newMusicRecord.publicationYear" type="number" step="1" required></label>
        </div><p v-if="addError" class="form-message form-error" role="alert">{{ addError }}</p><button class="primary-button" type="submit" :disabled="submitting">{{ submitting ? 'Adding...' : 'Add record' }}</button>
      </form>
      <form v-if="isAuthenticated && editingRecordId !== null" class="record-form" @submit.prevent="updateMusicRecord">
        <h2>Edit music record</h2><div class="form-fields">
          <label>Title <input v-model.trim="editMusicRecord.title" type="text" required></label><label>Artist <input v-model.trim="editMusicRecord.artist" type="text" required></label>
          <label>Duration <input v-model.trim="editMusicRecord.duration" type="text" required></label><label>Year <input v-model.number="editMusicRecord.publicationYear" type="number" step="1" required></label>
        </div><p v-if="editError" class="form-message form-error" role="alert">{{ editError }}</p><div class="form-actions">
          <button class="primary-button" type="submit" :disabled="updating">{{ updating ? 'Updating...' : 'Save changes' }}</button><button class="secondary-button" type="button" :disabled="updating" @click="cancelEdit">Cancel</button>
        </div>
      </form>
      <div class="table-container"><table><caption class="visually-hidden">Music records</caption><thead><tr><th scope="col">Title</th><th scope="col">Artist</th><th scope="col">Duration</th><th scope="col">Year</th><th v-if="isAuthenticated" scope="col">Actions</th></tr></thead>
        <tbody><tr v-if="loading"><td class="table-message" :colspan="isAuthenticated ? 5 : 4">Loading music records...</td></tr><tr v-else-if="error"><td class="table-message table-error" :colspan="isAuthenticated ? 5 : 4" role="alert">{{ error }}</td></tr><tr v-else-if="musicRecords.length === 0"><td class="table-message" :colspan="isAuthenticated ? 5 : 4">No music records found.</td></tr>
          <tr v-for="(record, index) in musicRecords" :key="record.id ?? index"><td class="record-title">{{ record.title }}</td><td>{{ record.artist }}</td><td>{{ record.duration }}</td><td>{{ record.publicationYear }}</td><td v-if="isAuthenticated"><div class="record-actions"><button class="update-btn" type="button" :disabled="updating" @click="editMusicRecordFor(record)">Update</button><button class="delete-btn" type="button" @click="deleteMusicRecord(record.id)">Delete</button></div></td></tr>
        </tbody></table></div>
    </section>
  `,
  data() {
    return { musicRecords: [], loading: false, error: "", showAddForm: false, submitting: false, addError: "", editingRecordId: null, editMusicRecord: this.emptyRecord(), editError: "", updating: false, successMessage: "", searchTitle: "", searchArtist: "", newMusicRecord: this.emptyRecord() };
  },
  methods: {
    emptyRecord() { return { title: "", artist: "", duration: "", publicationYear: "" }; },
    requestConfig() { return this.authToken ? { headers: { Authorization: `Bearer ${this.authToken}` } } : {}; },
    async fetchMusicRecords() {
      this.loading = true; this.error = "";
      try {
        const response = await axios.get(window.AppConfig.musicRecordUrl, { ...this.requestConfig(), params: { title: this.searchTitle, artist: this.searchArtist } });
        this.musicRecords = response.data;
      } catch (error) { this.error = `Kunne ikke hente records: ${error.message}`; } finally { this.loading = false; }
    },
    toggleAddForm() { this.showAddForm = !this.showAddForm; if (this.showAddForm) this.cancelEdit(); this.addError = ""; this.successMessage = ""; },
    editMusicRecordFor(record) { this.showAddForm = false; this.editingRecordId = record.id; this.editMusicRecord = { title: record.title, artist: record.artist, duration: record.duration, publicationYear: record.publicationYear }; this.editError = ""; this.successMessage = ""; },
    cancelEdit() { this.editingRecordId = null; this.editError = ""; },
    async addMusicRecord() {
      this.submitting = true; this.addError = ""; this.successMessage = "";
      try { await axios.post(window.AppConfig.musicRecordUrl, { ...this.newMusicRecord, publicationYear: Number(this.newMusicRecord.publicationYear) }, this.requestConfig()); this.newMusicRecord = this.emptyRecord(); this.showAddForm = false; await this.fetchMusicRecords(); this.successMessage = "Music record added."; }
      catch (error) { this.addError = `Could not add music record: ${error.message}`; } finally { this.submitting = false; }
    },
    async updateMusicRecord() {
      this.updating = true; this.editError = ""; this.successMessage = "";
      try { await axios.put(`${window.AppConfig.musicRecordUrl}/${this.editingRecordId}`, { id: this.editingRecordId, ...this.editMusicRecord, publicationYear: Number(this.editMusicRecord.publicationYear) }, this.requestConfig()); this.cancelEdit(); await this.fetchMusicRecords(); this.successMessage = "Music record updated."; }
      catch (error) { this.editError = `Could not update music record: ${error.message}`; } finally { this.updating = false; }
    },
    async deleteMusicRecord(id) {
      if (!confirm("Are you sure you want to delete this record?")) return;
      try { await axios.delete(`${window.AppConfig.musicRecordUrl}/${id}`, this.requestConfig()); await this.fetchMusicRecords(); }
      catch (error) { this.error = `Could not delete record: ${error.message}`; }
    },
  },
  mounted() { this.fetchMusicRecords(); },
};
