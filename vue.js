const { createApp } = Vue; // Vi henter Vue-applikationen

        const baseurl = "https://localhost:7253/api/MusicRecord"; // Vi gemmer baseurl'en til vores REST-service i en variabel, så vi kan genbruge den flere steder i koden

        const app = createApp({
            data() {
                return {
                    musicRecords: [], // Vi opretter en tom array, som vi senere vil fylde med data fra vores REST-service
                    loading: false,
                    error: '',
                    newMusicRecord: { // Vi opretter et objekt, som vi vil bruge til at oprette nye musikrecords
                        title: "",
                        artist: "",
                        duration: "",
                        publicationYear: "",
                    }
                };

            },
            methods: {
                async fetchMusicRecords() { // Vi opretter en metode, som henter musikrecords fra vores REST-service
                    this.loading = true;
                    this.error = '';

                    try {
                        const response = await axios.get(baseurl); // Vi bruger axios til at lave et GET-kald til vores REST-service
                        this.musicRecords = response.data;
                    } catch (error) {
                        this.error = `Kunne ikke hente records: ${error.message}`;
                    } finally {
                        this.loading = false;
                    }
                },

            },
            mounted() {
                this.fetchMusicRecords();
            }
        }).mount('#app');
