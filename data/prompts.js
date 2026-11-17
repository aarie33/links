// Daftar prompt. Tambah objek baru {title, text} di array ini.
// Pakai backtick (`) untuk text supaya bisa multi-baris; escape ` jadi \` dan ${ jadi \${.
const PROMPTS = [
  {
    title: "Prompt Bikin Game Balapan 3D",
    text: `Peran: Kamu adalah senior game developer dan UI designer. Buatkan game kuis balapan 3D isometrik untuk kelas, dengan kualitas setara game komersial, dalam SATU file HTML.

## Konsep
Dua tim (Tim Merah vs Tim Ungu) balapan truk di lintasan 3D. Truk maju kalau timnya menjawab soal dengan benar. Dimainkan guru di depan kelas (proyektor) atau di HP.

## Aturan main (harus adil)
- Permainan dibagi menjadi BABAK. Setiap babak: Tim Merah menjawab 1 soal, lalu Tim Ungu menjawab 1 soal yang BERBEDA. Kedua tim selalu mendapat jumlah kesempatan yang sama.
- Jawaban benar = maju 1 petak. Benar dalam ≤5 detik = bonus turbo +1 petak (maksimal 2 petak per soal).
- Salah atau waktu habis = truk diam. Tampilkan jawaban yang benar + penjelasannya.
- Pemenang HANYA ditentukan di AKHIR babak, setelah kedua tim menjawab. Kalau Tim Merah sampai finish duluan, Tim Ungu tetap mendapat gilirannya di babak itu.
- Akhir babak: kalau hanya satu tim yang sampai finish, tim itu menang. Kalau keduanya sampai finish, hasilnya SERI dan masuk BABAK PENENTUAN.
- Kalau soal habis sebelum ada yang finish, tim terdepan menang. Kalau posisinya sama, masuk babak penentuan.
- Babak penentuan: masing-masing tim mendapat 1 soal baru. Satu benar + satu salah = yang benar menang. Sama-sama benar atau sama-sama salah = ulangi. Kalau 3 kali masih seri, menang tim dengan RATA-RATA waktu jawab benar tercepat (dibulatkan 0,1 detik). Kalau masih sama, umumkan seri resmi.
- Soal diacak dan tidak pernah muncul dua kali. Sisihkan 6 soal cadangan untuk babak penentuan. Di layar Atur Soal, tampilkan jumlah babak yang tersedia dan beri peringatan kalau soalnya tidak cukup untuk sampai finish.

## Kontrol guru
- Layar "Atur Soal": textarea dengan satu soal per baris:
  Pertanyaan | A | B | C | D | Jawaban (A/B/C/D) | Penjelasan (opsional)
  Isi awal dengan 30 contoh soal IPA kelas 5 SD yang faktanya benar. Validasi setiap baris dan tunjukkan nomor baris yang salah format. Simpan di localStorage.
- Pengaturan: nama tim, panjang lintasan (6/10/15, default 10), timer (10/20/30 detik), bonus turbo on/off.
- Saat bermain: tombol Jeda (timer ikut berhenti), tombol "Batalkan langkah terakhir" yang juga tersedia di layar pemenang (truk mundur, soal yang sama diulang), shortcut A–D / 1–4 untuk menjawab, Spasi untuk lanjut, P untuk jeda.

## Visual (wajib terlihat pro)
- Three.js lewat import map dari https://cdn.jsdelivr.net/npm/three@0.160.0/ (build/three.module.js dan examples/jsm/). Kamera ORTHOGRAPHIC, sudut serong dari belakang-atas, sehingga lintasan terlihat menanjak ke atas layar.
- Aset 3D Kenney (lisensi MIT), dimuat dengan GLTFLoader. Base URL:
  https://cdn.jsdelivr.net/gh/KenneyNL/Starter-Kit-Racing@main/models/
  track-straight.glb, track-finish.glb, vehicle-truck-red.glb, vehicle-truck-purple.glb, decoration-forest.glb, decoration-tents.glb, decoration-empty.glb
  Catatan aset: setiap potongan lintasan berukuran 10×10 dan jalannya searah sumbu Z. Truk berukuran ±1,5×2,8, jadi perbesar sekitar 2×. Model truk menghadap -Z, jadi PUTAR 180° supaya maju ke arah finish.
- Dua lajur sejajar, satu lajur per tim. Lajur Tim Merah harus tampil di KIRI layar, sama seperti posisinya di HUD.
- Kamera selalu membingkai KEDUA truk: pusatkan di tengah keduanya, zoom-out halus kalau jaraknya melebar, dan geser area pandang supaya truk tampil di ruang kosong DI ATAS kartu soal (jangan sampai tertutup kartu).
- Pencahayaan: HemisphereLight + DirectionalLight, bayangan lembut (PCFSoftShadowMap), ACESFilmic, SRGB, langit gradasi (CSS di belakang canvas transparan).
- Truk maju dengan animasi ease, sedikit melompat dan miring, roda berputar, debu partikel. Turbo = partikel api + garis kecepatan. Mesin bergetar halus saat diam.
- UI di atas canvas: kartu soal glassmorphism, 4 tombol jawaban besar berwarna beda (label A–D), timer berbentuk cincin yang memerah di 5 detik terakhir, papan skor dengan progress bar, label "Babak 3 · Giliran Tim Merah", dan banner besar saat ganti babak / SERI.
- Animasi UI pakai GSAP (https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js). Font "Baloo 2" dari Google Fonts.
- Layar menang: kamera zoom ke truk pemenang yang melompat dan berputar, confetti (https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js), lalu statistik per tim (posisi akhir, jumlah benar, rata-rata waktu benar, jumlah turbo) + "soal tersulit" + alasan kemenangan.

## Suara
Semua suara dibuat dengan Web Audio API (tanpa file): klik, benar, salah, detak 5 detik terakhir, mesin, turbo, fanfare kemenangan. Tombol mute disimpan di localStorage.

## Kualitas
- Layar loading dengan progress bar. Kalau ada aset yang gagal dimuat, ganti dengan bentuk sederhana berwarna supaya game tetap jalan.
- Landscape untuk proyektor. Di HP (≤560px): pilihan jawaban 1 kolom, tombol Lanjut selebar kartu, nama tim tidak terpotong.
- pixelRatio maksimal 2. Semua teks dalam Bahasa Indonesia.

## Output
Satu file HTML LENGKAP, jangan dipotong, tanpa placeholder. Sebelum mengirim, uji sendiri skenario berikut: (1) Merah sampai finish, Ungu tetap dapat giliran; (2) dua tim finish di babak yang sama → babak penentuan; (3) 3 kali seri → penentu waktu; (4) Batalkan dari layar pemenang. Pastikan tidak ada error di console.`
  },
  {
    title: "Prompt Bikin Game Matematika 3D",
    text: `Peran: Kamu adalah senior game developer dan UI designer. Buatkan game edukasi matematika 3D untuk anak SD, kualitas setara game mobile komersial, dalam SATU file HTML.

## Konsep
Seorang karakter berdiri di pulau terapung. Di atas layar muncul soal (misal "7 × 8 = ?"). Di depan karakter ada 3 pulau terapung, masing-masing bertuliskan satu jawaban. Anak menyentuh pulau dengan jawaban yang benar, lalu karakter MELOMPAT ke pulau itu dan mengambil koin. Kalau salah, pulau itu retak dan jatuh, nyawa berkurang 1, dan karakter tetap di tempat untuk mencoba lagi dengan 2 pilihan yang tersisa. Setelah 10 soal, muncul pulau bendera dan karakter melompat ke sana = level selesai.

## Pilihan di layar mulai
- Kelas: 1–2, 3–4, 5–6. Materi: Tambah, Kurang, Kali, Bagi, Campur. Tampilkan bintang terbaik di tombol tiap materi.
- Rentang angka:
  kelas 1–2: tambah/kurang sampai 20, perkalian tabel 1–5, pembagian dari tabel 1–5;
  kelas 3–4: tambah/kurang sampai 100, perkalian/pembagian tabel 2–10;
  kelas 5–6: tambah/kurang sampai 1000, perkalian 2 digit × 1 digit, pembagian hasil 2 digit.
- Opsi "Bacakan soal" pakai speechSynthesis id-ID ("tujuh kali delapan sama dengan berapa?"). Simpan pilihan di localStorage.

## Aturan soal (dibuat kode, tanpa internet atau API)
- Hasil pengurangan tidak pernah negatif. Pembagian selalu habis dibagi. Soal yang sama tidak muncul dua kali dalam satu level.
- 2 pengecoh harus masuk akal: selisih ±1/±2, ±10 (kalau jawaban ≥20), atau kesalahan khas anak (tambah↔kurang tertukar, perkalian meleset satu baris seperti (a+1)×b). JANGAN pakai hasil perkalian sebagai pengecoh soal penjumlahan.
- PENTING: acak posisi jawaban benar di antara 3 angka (terkecil / tengah / terbesar) dengan peluang sama, supaya anak tidak bisa menang dengan selalu memilih angka tengah. Pengecoh tidak boleh negatif atau dobel.
- 3 nyawa. Nyawa habis = layar "Coba Lagi, Yuk!" yang ramah anak (tanpa kata "kalah").
- Skor: benar +10; bonus +5 kalau benar di percobaan pertama dalam <3 detik; combo setiap 3 kali benar berturut-turut di percobaan pertama = efek bintang + tulisan "Combo 3×!".
- Akhir level: ⭐⭐⭐ tanpa salah, ⭐⭐ maksimal 1 salah, ⭐ selesai. Tampilkan daftar soal yang salah beserta jawabannya ("Ayo ulangi: 7 × 8 = 56"). Simpan bintang terbaik per kelas + materi.

## Aset 3D (Kenney, lisensi MIT), dimuat dengan GLTFLoader
Base: https://cdn.jsdelivr.net/gh/KenneyNL/Starter-Kit-3D-Platformer@main/models/
character.glb, platform-grass-large-round.glb, coin.glb, flag.glb, cloud.glb
Fakta aset (sudah dicek, ikuti persis):
- character.glb tingginya ±0,8 dan punya animasi "idle", "walk", "jump". Mainkan dengan AnimationMixer (jump = LoopOnce). Model menghadap +Z pada rotasi 0. Perbesar 1,6× dan putar supaya selalu menghadap pulau tujuan sebelum melompat.
- platform-grass-large-round.glb berdiameter 5 dan tebal 0,5 (pulau berumput). Pakai skala ±0,54 untuk pulau jawaban dan ±0,74 untuk pulau tempat berdiri, dan samakan tinggi permukaan atasnya. Tambahkan kerucut tanah (flatShading) menggantung di bawah tiap pulau. JANGAN pakai platform.glb (permukaannya hitam).
- flag.glb: kain bendera mengarah ke +Z, jadi putar −90° supaya kainnya menghadap kamera.
- cloud.glb berbentuk kotak besar, jadi letakkan awan DI BAWAH level pulau supaya tidak pernah menghalangi kamera.

## Visual & experience
- Three.js lewat import map dari https://cdn.jsdelivr.net/npm/three@0.160.0/. Kamera perspektif dari belakang-atas karakter, mengikuti karakter dengan halus (posisi X juga ikut). Di HP portrait pakai FOV lebih lebar supaya 3 pulau muat.
- Barisan 3 pulau selalu berpusat di depan posisi karakter saat ini (jangan di X tetap), berjarak ±3,2 antar pulau dan ±6,5 ke depan. Pulau muncul dari bawah dengan animasi back-out dan melayang naik-turun pelan.
- Angka jawaban ditulis besar di atas tiap pulau pakai sprite dari CanvasTexture (font "Baloo 2", huruf putih bergaris tepi gelap).
- Area sentuh tiap pulau dibuat besar dengan kotak tak terlihat (±3×4×3) supaya mudah disentuh anak.
- Lompatan: ancang-ancang (squash), lengkung parabola, mendarat (squash lalu elastic) + debu. Koin berputar naik dan angka "+10" melayang.
- Salah: pulau bergetar, label berubah merah, pulau jatuh sambil berputar; layar bergetar sedikit; hati di HUD memantul lalu jadi abu-abu. Suaranya lembut, tidak menakutkan.
- Level selesai: pulau bendera muncul, karakter melompat ke sana, lalu berbalik menghadap kamera dan melompat-lompat gembira + confetti (https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js).
- Langit gradasi pastel, kabut, laut di bawah, bayangan lembut, ACESFilmic, SRGB.
- HUD: soal besar di tengah atas, jalur titik progres 1–10 + 🏁 (hijau = benar langsung, kuning = sempat salah), 3 hati, skor koin, tombol bacakan / mute / jeda. Petunjuk "Sentuh pulau dengan jawaban yang benar" di soal pertama.
- Animasi UI pakai GSAP (https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js). Suara Web Audio (lompat, mendarat, koin, salah, combo, fanfare).
- Kontrol: sentuh/klik pulau, atau tombol 1/2/3 dan panah kiri/atas/kanan.
- Layar loading dengan progress bar. Kalau ada aset yang gagal dimuat, ganti dengan bentuk sederhana. pixelRatio maksimal 2. Semua teks Bahasa Indonesia, tanpa link keluar.

## Output
Satu file HTML LENGKAP, jangan dipotong, tanpa placeholder. Sebelum mengirim, uji sendiri: bangkitkan ribuan soal untuk setiap kelas × materi dan pastikan tidak ada angka negatif, pembagian bersisa, atau pilihan dobel, serta jawaban benar tersebar rata di posisi terkecil/tengah/terbesar; karakter menghadap pulau tujuan; nyawa habis menampilkan "Coba Lagi, Yuk!". Pastikan tidak ada error di console.`
  },
  {
    title: "Prompt Simulasi Tata Surya 3D",
    text: `Buatkan aplikasi web interaktif "Jelajah Tata Surya" bergaya 3D ISOMETRIK untuk media pembelajaran anak SD–SMP (usia 8–14 tahun). Semua teks memakai Bahasa Indonesia yang ramah anak, singkat, dan mudah dipahami.

## Teknis
- SATU file HTML lengkap (HTML + CSS + JS dalam satu file), langsung bisa dibuka di browser tanpa server.
- Gunakan Three.js lewat importmap dari CDN dengan versi pasti (contoh: three@0.160.0 dari cdn.jsdelivr.net).
- Pakai kamera ISOMETRIK: THREE.OrthographicCamera dengan sudut isometrik klasik (diputar 45° di sumbu Y dan ±35,26° ke bawah). Tidak ada efek perspektif.
- Kontrol kamera:
  - Geser (drag/swipe) untuk pan.
  - Scroll atau cubit untuk zoom (ubah camera.zoom, dengan batas min/max).
  - Tombol ⟲ ⟳ untuk memutar sudut pandang 90° dengan animasi halus.
  - JANGAN pakai rotasi bebas, supaya sudut isometrik selalu terjaga.
- Jangan memakai gambar dari luar. Semua tekstur dan warna dibuat secara prosedural (warna per-face/vertex color).
- Harus lancar di laptop sekolah yang lambat dan di HP/tablet (bisa disentuh). Tampilan responsif: di HP panel info muncul dari bawah (bottom sheet, latar tidak transparan), di layar besar muncul di samping.

## Gaya visual: diorama low-poly
- Seluruh tata surya terlihat seperti miniatur di atas "papan" melingkar gelap yang melayang di angkasa (seperti maket mainan), dengan pinggiran tebal.
- Planet melayang di atas papan dan ditopang tiang kecil seperti maket, dengan bayangan bulat lembut di papan tepat di bawahnya.
- Semua objek low-poly dengan flat shading (IcosahedronGeometry detail rendah) dan material toon (MeshToonMaterial) berwarna cerah. Beri outline tipis gelap (teknik inverted hull).
- Ciri khas planet dari geometri dan warna, bukan foto: Jupiter bergaris dengan bintik merah, Saturnus dengan cincin low-poly, Bumi dengan pulau hijau di laut biru dan awan putih kecil, Mars merah dengan tudung es di kutub, Uranus dan Neptunus biru kehijauan, Pluto dengan daerah "hati" putih.
- Matahari berupa bola low-poly kuning-oranye yang berdenyut pelan dengan glow, dan menjadi sumber cahaya.
- Orbit digambar sebagai jalur putus-putus di permukaan papan.
- Latar: gradasi ungu tua ke biru malam dengan bintang-bintang kecil berkelip.

## Isi simulasi
1. Delapan planet: Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, Neptunus. Masing-masing berotasi dan mengorbit Matahari dengan urutan kecepatan yang benar, dan kemiringan poros yang benar (Uranus hampir berguling). Posisi awal planet dihitung dari tanggal hari ini (bujur rata-rata J2000), jadi letaknya kira-kira sesuai kenyataan.
2. Satelit utama mengorbit planetnya:
   - Bumi: Bulan
   - Mars: Fobos, Deimos
   - Jupiter: Io, Europa, Ganimede, Kalisto
   - Saturnus: Titan, Enceladus, Rhea, Mimas
   - Uranus: Titania, Oberon, Miranda
   - Neptunus: Triton (orbit retrograde/berlawanan arah)
3. Pluto dan Charon (planet kerdil), Sabuk Asteroid berupa batu-batu low-poly (InstancedMesh) di antara Mars dan Jupiter, Sabuk Kuiper tipis di pinggir papan, dan satu komet dengan orbit lonjong (persamaan Kepler) dan ekor yang mengarah menjauhi Matahari.
4. Ukuran dan jarak memakai "skala mudah dilihat" supaya semua muat di papan. Atur jaraknya supaya sistem satelit Jupiter, Saturnus (termasuk cincinnya), Uranus, dan Neptunus tidak saling tumpang tindih. Tampilkan tombol kecil "Kenapa jaraknya diperkecil?" dengan analogi ramah anak (contoh: kalau Bumi sebesar kelereng, Matahari setinggi ±1,4 m dan berjarak ±150 m).

## Interaksi
- Hover/tap objek: objek sedikit membesar dan muncul label nama.
- Klik objek: kamera zoom halus dan mengikuti objek itu (tetap isometrik), objek mendapat cincin sorot berkedip di bawahnya, lalu panel info terbuka.
- Panel info berisi: nama, ikon jenis (planet batuan / raksasa gas / raksasa es / satelit / planet kerdil), diameter, jarak dari Matahari (km dan SA), lama 1 hari, lama 1 tahun, suhu rata-rata, jumlah satelit yang diketahui, 3 fakta "Tahukah Kamu?", dan perbandingan dengan Bumi (contoh: "Jupiter muat ±1.300 Bumi"). Panel planet berisi tombol untuk lompat ke satelitnya, dan panel satelit berisi tombol "Kembali ke planet".
- Tombol "🔊 Dengarkan" membacakan info memakai Web Speech API (lang id-ID). Pecah teks per kalimat supaya suara tidak berhenti di tengah.
- Label nama di atas semua objek bisa dinyalakan/dimatikan.
- Daftar objek di samping (planet → buka untuk melihat satelitnya) untuk lompat cepat. Di HP, daftar ini jadi laci yang bisa dibuka-tutup.
- Kontrol waktu: jeda, 1x, 10x, 100x, plus penunjuk tanggal simulasi dan "Hari ke-…".
- Tombol "🏠 Lihat Semua" untuk kembali ke tampilan seluruh papan.

## Mode belajar
1. **Kuis**: 10 soal acak (7 pilihan ganda dari bank ±20 soal, ditambah 3 soal "Klik planet yang benar!" yang dijawab dengan mengklik planet di papan). Beri skor yang langsung bertambah, bintang di akhir (0–3), konfeti saat benar, dan penjelasan singkat saat salah (sebutkan juga benda apa yang diklik).
2. **Bandingkan Ukuran**: planet-planet melompat keluar dari orbitnya lalu berbaris dari kecil ke besar dengan **ukuran sesuai perbandingan asli** (diameter relatif terhadap Bumi). Matahari ditampilkan dengan ukuran aslinya (109× Bumi) sebagai lengkungan raksasa di belakang barisan. Ada tombol "Kembali ke orbit" dengan animasi balik.
3. **Tur Otomatis**: kamera berpindah dari Matahari ke tiap planet (termasuk sabuk asteroid, Pluto, dan komet), dengan narasi suara dan teks. Ada tombol jeda/lanjut, berikutnya, dan selesai. Di akhir tur, tawarkan untuk main kuis.

## Detail penting (wajib, sering terlewat)
- **Matahari tidak boleh menutupi objek yang difokuskan.** Di sudut isometrik, planet di belakang Matahari akan tertutup. Jika objek yang sedang diikuti kamera berada di belakang Matahari, buat Matahari transparan sementara.
- **Saat soal "klik planet", sembunyikan semua label nama** (termasuk label hover), karena label akan membocorkan jawaban. Untuk soal planet dalam (Merkurius–Mars), zoom ke bagian dalam tata surya supaya planet kecil mudah diklik.
- **Deteksi klik yang ramah anak**: pilih objek terdekat di layar dalam radius minimal ±12 px dari tepi objek, bukan hanya raycast pada mesh. Satelit dan planet kecil sangat sulit diklik kalau tidak begini.
- **Label tidak boleh bertumpuk**: label satelit hanya muncul kalau sudah di-zoom cukup dekat. Di layar kecil atau zoom jauh, kurangi label (contoh: sembunyikan label sabuk, komet, dan planet yang terlalu rapat) dan pakai ukuran huruf lebih kecil.
- **Framing kamera harus memperhitungkan UI**: saat panel info terbuka, geser pusat pandang supaya objek tidak tertutup panel (di samping untuk desktop, di atas bottom sheet untuk HP). "Lihat Semua" harus memuat seluruh papan tanpa terpotong daftar di kiri atau tombol di kanan.
- **Mode Bandingkan di layar HP (portrait)**: gunakan dua baris (6 planet kecil di depan, Jupiter dan Saturnus di belakang) supaya tidak terpotong. Beri jarak ekstra untuk cincin Saturnus, sembunyikan tombol samping, dan susun label planet kecil bertingkat supaya tidak saling menimpa.
- **Kecepatan visual**: orbit planet boleh mengikuti waktu simulasi, tapi rotasi planet dan orbit satelit (misalnya Io yang hanya 1,8 hari) harus diperlambat khusus untuk tampilan supaya tidak berkedip/berputar terlalu cepat di 100x. Beri catatan kecil di panel bahwa gerakannya diperlambat. Begitu juga komet: percepat orbitnya supaya terlihat lewat, dan beri keterangan.
- Saat masuk satu mode, tutup mode lain dengan rapi (kuis, tur, dan bandingkan tidak boleh berjalan bersamaan).

## Akurasi
- Semua angka dan fakta harus akurat sesuai data NASA. Simpan semua data dalam satu objek JS \`DATA_TATA_SURYA\` di bagian atas script supaya mudah dicek dan diedit guru. Pisahkan data ilmiah dari pengaturan tampilan (ukuran/jarak visual) dalam objek terpisah.
- Pluto disebut "planet kerdil", dengan penjelasan singkat mengapa sejak 2006 tidak lagi disebut planet.

## UI
- Gaya UI seperti game kasual: tombol bulat besar (minimal 44px), sudut membulat, bayangan lembut, warna cerah. Pakai font "Baloo 2" atau "Nunito" dari Google Fonts.
- Saat pertama dibuka, tampilkan layar sambutan "Ayo Jelajahi Tata Surya! 🚀" dengan tombol Mulai dan tutorial 3 langkah (geser, zoom, klik planet).
- Animasi halus (target 60fps): pakai requestAnimationFrame, easing untuk semua gerakan kamera, dan sesuaikan ukuran saat jendela diubah.

Berikan kode lengkap tanpa dipotong dan tanpa placeholder.`
  }
];
