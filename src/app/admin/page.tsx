'use client'

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Navbar from "@/ui/navbar";
import { poppins, poppinsSB } from "@/fonts/font";
import { Pencil, Trash } from "lucide-react";
import { showToast } from "nextjs-toast-notify";
import type { Session } from '@supabase/supabase-js'
import { useRouter } from "next/navigation";
import Image from "next/image";

type product = {
  id:number,
  harga:string,
  desc:string
  img_url:string
}
type porto = {
  id:number,
  desc1:string,
  desc2:string
  img_url:string
}
type testi = {
  id:number,
  nama:string,
  testi:string
  headline:string
}

interface ProductUpdate {
  img_url?:string
  harga: string;
  desc: string[]; // atau: string, kalau bukan array
}

interface TestiUpdate {
  headline:string
  nama: string;
  testi: string; // atau: string, kalau bukan array
}

interface PortoUpdate {
  img_url?:string
  desc1: string;
  desc2: string; // atau: string, kalau bukan array
}

export default function Home() {
  const [harga, setHarga] = useState<string>('')
  const [descs, setDescs] = useState<string[]>(['']);
  const [desc1, setDesc1] = useState<string>('')
  const [desc2, setDesc2] = useState<string>('')
  const [nama, setNama] = useState<string>('')
  const [testi, setTesti] = useState<string>('')
  const [headline, setHeadline] = useState<string>('')
  const [service1, setService1] = useState<string>('')
  const [jumlahService1, setjumlahService1] = useState<string>('')
  const [service2, setService2] = useState<string>('')
  const [jumlahService2, setjumlahService2] = useState<string>('')
  const [service3, setService3] = useState<string>('')
  const [jumlahService3, setjumlahService3] = useState<string>('')
  const [about, setAbout] = useState<string>('')
  const [noTelp, setNoTelp] = useState<string>('')
  const [alamat, setAlamat] = useState<string>('')
  const [linkGps, setLinkGps] = useState<string>('')
  const [res, setRes] = useState<number>(0) 
  const [datas, setDatas] = useState<product[] | null>([]) 
  const [portos, setPortos] = useState<porto[] | null>([]) 
  const [testies, setTesties] = useState<testi[] | null>([]) 
  const [siteSetIsActive, setSiteSetIsActive] = useState<boolean>(true)
  const [productIsActive, setProductIsActive] = useState<boolean>(false)
  const [portoIsActive, setPortoIsActive] = useState<boolean>(false)
  const [testiIsActive, setTestiIsActive] = useState<boolean>(false)
  const [editProdIsActive, setEditProdIsActive] = useState<boolean>(false)
  const [editPortoIsActive, setEditPortoIsActive] = useState<boolean>(false)
  const [editTestiIsActive, setEditTestiIsActive] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [id, setId] = useState(0)
  const [session, setSession] = useState<Session | null>(null)

  const handleSubmit = () => {
    const insert = async () => {
      try {
        let imageUrl = ''

        // Upload dulu kalau ada file
        if (file) {
          const fileExt = file.name.split('.').pop()
          const fileName = `${Date.now()}.${fileExt}`
          const filePath = `uploads/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('productimg')
            .upload(filePath, file)

          if (uploadError) {
            console.error('Upload gagal:', uploadError)
            return
          }

          // Dapatkan public URL gambar
          const { data } = supabase.storage
            .from('productimg')
            .getPublicUrl(filePath)

          imageUrl = data.publicUrl
        }else{
          showToast.warning("Gambar tidak boleh kosong!", {
            duration: 4000,
            progress: true,
            position: "top-center",
            transition: "bounceIn",
            icon: '',
            sound: true,
          });

          return
        }

        // Insert ke tabel product
        const { error: insertError } = await supabase
          .from('product')
          .insert({
            harga: harga,
            desc: descs,
            img_url: imageUrl,
          });

        if (insertError) {
          showToast.error(`Insert gagal: ${insertError.message}`, {
            duration: 4000,
            progress: true,
            position: "top-center",
            transition: "bounceIn",
            icon: '',
            sound: true,
          });
        } else {
          showToast.success("Produk baru berhasil disimpan!", {
            duration: 4000,
            progress: true,
            position: "top-center",
            transition: "bounceIn",
            icon: '',
            sound: true,
          });
          setRes(res + 1)
          setHarga('')
          setDescs(['']); // reset jadi 1 field kosong
          setPreviewUrl('')
          setFile(null)
        }
      } catch (error) {
        console.error('Unexpected error:', error)
      }
    }

    insert()
  }

  const getById = async (id: number, kolom: string) => {
    try {
      const { data, error } = await supabase
        .from(kolom)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Set harga
      setHarga(data.harga)

      // ⬇️ Ini bagian penting: set state desc langsung dari array-nya
      if (Array.isArray(data.desc)) {
        setDescs(data.desc)
      } else {
        setDescs(['']) // fallback kalau desc bukan array
      }

      // Kalau mau juga set file preview lama, tambahin ini:
      if (data.img_url) {
        setPreviewUrl(data.img_url)
      }

    } catch (error) {
      console.error('Error getById:', error)
    }
  }


  const handleUpdate = (id: number) => {
    const update = async () => {
      try {
        let imageUrl = '';

        // ⬇️ Upload gambar baru kalau ada file
        if (file) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `uploads/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('productimg')
            .upload(filePath, file);

          if (uploadError) {
            console.error('Upload gagal:', uploadError);
            return;
          }

          // Ambil URL public gambar
          const { data } = supabase.storage
            .from('productimg')
            .getPublicUrl(filePath);

          imageUrl = data.publicUrl;
        }

        // ⬇️ Susun data yang mau diupdate
        const updateData: ProductUpdate = {
          harga,
          desc: descs,
        };

        console.log(harga);
        

        // ⬇️ Kalau ada gambar baru, tambahkan ke data update
        if (imageUrl) {
          updateData.img_url = imageUrl;
        }
        console.log('Data yang dikirim ke Supabase:', updateData)

        // ⬇️ Update data produk
        const { error: updateError } = await supabase
          .from('product')
          .update(updateData)
          .eq('id', id);

        if (updateError) {
          showToast.error(`Update gagal: ${updateError}`, {
            duration: 4000,
            progress: true,
            position: "top-center",
            transition: "bounceIn",
            icon: '',
            sound: true,
          });
        } else {
          showToast.success("Produk berhasil diupdate!", {
              duration: 4000,
              progress: true,
              position: "top-center",
              transition: "bounceIn",
              icon: '',
              sound: true,
            });
          setRes(res + 1);
          setHarga('');
          setDescs(['']);
          setFile(null);
          setPreviewUrl('');
        }
        setEditProdIsActive(false)
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    update();
  };

  const updatePortofolio = (id: number) => {
    const update = async () => {
      try {
        let imageUrl = '';

        // ⬇️ Upload gambar baru kalau ada file
        if (file) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `uploads/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('portoimg') // ganti bucket
            .upload(filePath, file);

          if (uploadError) {
            console.error('Upload gambar gagal:', uploadError);
            return;
          }

          // Ambil URL public gambar
          const { data } = supabase.storage
            .from('portoimg') // ganti bucket
            .getPublicUrl(filePath);

          imageUrl = data.publicUrl;
        }

        // ⬇️ Susun data yang mau diupdate (desc bukan array!)
        const updateData: PortoUpdate = {
          desc1,
          desc2: desc2
        };

        // Tambahkan gambar kalau ada file baru
        if (imageUrl) {
          updateData.img_url = imageUrl;
        }

        console.log('Data update ke portofolio:', updateData);

        // ⬇️ Update ke tabel portofolio
        const { error: updateError } = await supabase
          .from('portofolio')
          .update(updateData)
          .eq('id', id);

        if (updateError) {
          showToast.error(`Update portofolio gagal:, ${updateError.message}`, {
            duration: 4000,
            progress: true,
            position: "top-center",
            transition: "bounceIn",
            icon: '',
            sound: true,
          });
        } else {
          showToast.success("Update portofolio berhasil!", {
              duration: 4000,
              progress: true,
              position: "top-center",
              transition: "bounceIn",
              icon: '',
              sound: true,
            });
          setRes(res + 1);
          setDesc1('');
          setDesc2('');
          setFile(null);
          setPreviewUrl('');
        }
        setEditPortoIsActive(false)
      } catch (error) {
        console.error('Unexpected error (portofolio):', error);
      }
    };

    update();
  };

  const updateTesti = (id: number) => {
    const update = async () => {
      try {
        // ⬇️ Susun data yang mau diupdate (desc bukan array!)
        const updateData: TestiUpdate = {
          headline,
          nama: nama,
          testi: testi
        };

        // Tambahkan gambar kalau ada file baru

        console.log('Data update ke portofolio:', updateData);

        // ⬇️ Update ke tabel portofolio
        const { error: updateError } = await supabase
          .from('testimoni')
          .update(updateData)
          .eq('id', id);

        if (updateError) {
          showToast.error(`Update testimoni gagal:, ${updateError}`, {
            duration: 4000,
            progress: true,
            position: "top-center",
            transition: "bounceIn",
            icon: '',
            sound: true,
          });
        } else {
          showToast.success("Update testimoni berhasil!", {
              duration: 4000,
              progress: true,
              position: "top-center",
              transition: "bounceIn",
              icon: '',
              sound: true,
            });
          setRes(res + 1);
          setHeadline('');
          setNama('');
          setTesti('');
          setEditTestiIsActive(false)
        }
      } catch (error) {
        console.error('Unexpected error (portofolio):', error);
      }
    };

    update();
  };

  const deleteData = async (id: number, table:string, bucket:string) => {
    console.log(id, table, bucket);
    
    try {
      // ⬇️ 1. Ambil data produk dulu buat dapetin path gambarnya
      const { data: product, error: fetchError } = await supabase
        .from(table)
        .select('img_url')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Gagal ambil data produk:', fetchError);
        return;
      }

      // ⬇️ 2. Hapus file dari storage kalau ada img_url
      if (product?.img_url) {
        const urlParts = product.img_url.split('/');
        const fileName = urlParts[urlParts.length - 1]; // ambil nama file dari URL

        const { error: deleteFileError } = await supabase.storage
          .from(bucket)
          .remove([`uploads/${fileName}`]);

        if (deleteFileError) {
          console.error('Gagal hapus gambar:', deleteFileError);
          return;
        }
      }

      // ⬇️ 3. Hapus data dari tabel
      const { error: deleteDataError } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (deleteDataError) {
        console.error('Gagal hapus data:', deleteDataError);
      } else {
        showToast.success("Data berhasil dihapus!", {
          duration: 4000,
          progress: true,
          position: "top-center",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });
        setRes(res + 1); // kalau mau refresh data
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const getByIdPorto = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('portofolio')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Set harga
      setDesc1(data.desc1)
      setDesc2(data.desc2)

      // Kalau mau juga set file preview lama, tambahin ini:
      if (data.img_url) {
        setPreviewUrl(data.img_url)
      }

    } catch (error) {
      console.error('Error getById:', error)
    }
  }

  const getByIdTesti = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('testimoni')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Set harga
      setHeadline(data.headline)
      setTesti(data.testi)
      setNama(data.nama)

      // Kalau mau juga set file preview lama, tambahin ini:
      if (data.img_url) {
        setPreviewUrl(data.img_url)
      }

    } catch (error) {
      console.error('Error getById:', error)
    }
  }

  const handleSubmitPorto = () => {
    const insert = async () => {
      try {
        let imageUrl = ''

        // Upload dulu kalau ada file
        if (file) {
          const fileExt = file.name.split('.').pop()
          const fileName = `${Date.now()}.${fileExt}`
          const filePath = `uploads/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('portoimg')
            .upload(filePath, file)

          if (uploadError) {
            console.error('Upload gagal:', uploadError)
            return
          }

          // Dapatkan public URL gambar
          const { data } = supabase.storage
            .from('portoimg')
            .getPublicUrl(filePath)

          imageUrl = data.publicUrl
        }else{
          showToast.warning("Gambar tidak boleh kosong!", {
            duration: 4000,
            progress: true,
            position: "top-center",
            transition: "bounceIn",
            icon: '',
            sound: true,
          });

          return
        }

        // Insert ke tabel product
        // Insert ke tabel product
        const { error: insertError } = await supabase
          .from('portofolio')
          .insert({
            desc1: desc1,
            desc2: desc2, // kirim array of string ke jsonb
            img_url: imageUrl,
          });

        if (insertError) {
          showToast.error(`Portofolio gagal ditambahkan!: ${insertError.message}`, {
            duration: 4000,
            progress: true,
            position: "top-center",
            transition: "bounceIn",
            icon: '',
            sound: true,
          });
        } else {
          showToast.success("Portofolio berhasil ditambahkan!", {
              duration: 4000,
              progress: true,
              position: "top-center",
              transition: "bounceIn",
              icon: '',
              sound: true,
            });
          setRes(res + 1)
          setDesc1('')
          setDesc2(''); // reset jadi 1 field kosong
          setFile(null)
          setPreviewUrl('')
        }
      } catch (error) {
        console.error('Unexpected error:', error)
      }
    }

    insert()
  }

  const handleSubmitTesti = () => {
    const insert = async () => {
      try {
        const { error: insertError } = await supabase
          .from('testimoni')
          .insert({
            nama: nama,
            testi: testi, // kirim array of string ke jsonb
            headline: headline
          });

        if (insertError) {
          showToast.error(`Testimoni gagal ditambahkan!: ${insertError}`, {
            duration: 4000,
            progress: true,
            position: "top-center",
            transition: "bounceIn",
            icon: '',
            sound: true,
          });
        }else{
          showToast.success("Testimoni berhasil ditambahkan!", {
              duration: 4000,
              progress: true,
              position: "top-center",
              transition: "bounceIn",
              icon: '',
              sound: true,
            });
          setRes(res + 1)
          setNama('')
          setTesti(''); // reset jadi 1 field kosong
          setHeadline('')
        }
      } catch (error) {
        console.error('Unexpected error:', error)
      }
    }

    insert()
  }

  const addDescField = () => {
  setDescs([...descs, '']);
  };

  const handleDescChange = (index: number, value: string) => {
    const updated = [...descs];
    updated[index] = value;
    setDescs(updated);
  };

  const removeDescField = (index: number) => {
    if (descs.length === 1) return; // Jangan sampai kosong
    const updated = [...descs];
    updated.splice(index, 1);
    setDescs(updated);
  };

  const handleUpdtSite = async() => {
    const updates = [
      { key_param: 'service1', key_value: service1 },
      { key_param: 'jumlah_service1', key_value: jumlahService1 },
      { key_param: 'service2', key_value: service2 },
      { key_param: 'jumlah_service2', key_value: jumlahService2 },
      { key_param: 'service3', key_value: service3 },
      { key_param: 'jumlah_service3', key_value: jumlahService3 },
      { key_param: 'about', key_value: about },
      { key_param: 'telp', key_value: noTelp },
      { key_param: 'alamat', key_value: alamat },
      { key_param: 'linkGps', key_value: linkGps },
    ];

    try {
      for (const item of updates) {
        const { error } = await supabase
          .from('site_settings')
          .update({ key_value: item.key_value })
          .eq('key_param', item.key_param);

        if (error) {
          showToast.error(`Gagal update ${item.key_param}: ${error}`, {
            duration: 4000,
            progress: true,
            position: "top-center",
            transition: "bounceIn",
            icon: '',
            sound: true,
          });
        }
      }
      showToast.success("Site Setting berhasil diupdate!", {
        duration: 4000,
        progress: true,
        position: "top-center",
        transition: "bounceIn",
        icon: '',
        sound: true,
      });
    } catch (error) {
      console.log(error);
      
    }
  }
  const router = useRouter()

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if(!session)(
        router.push('/')
      )
      setSession(session)
    }
    fetchSession()
    const getData = async () => {
      try {
        const { data, error } = await supabase
          .from('product')
          .select('*').order('id', { ascending: false })
          
          if(error) console.log(error);
          setDatas(data)
      } catch (error) {
        console.log(error);
        
      }
    }
    const getDataPorto = async () => {
      try {
        const { data, error } = await supabase
          .from('portofolio')
          .select('*').order('id', { ascending: false })
          
          if(error) console.log(error);
          setPortos(data)
      } catch (error) {
        console.log(error);
        
      }
    }
    const getDataTesti = async () => {
      try {
        const { data, error } = await supabase
          .from('testimoni')
          .select('*').order('id', { ascending: false })
          
          if(error) console.log(error);
          setTesties(data)
          console.log(data);
          
      } catch (error) {
        console.log(error);
        
      }
    }

    const getSiteSettings = async() => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')

          console.log(data);
          
          
          if(error) console.log(error);
          data?.forEach((item) => {
            switch (item.key_param) {
              case 'service1':
                console.log('haloo');
                
                setService1(item.key_value)
                break;
              case 'jumlah_service1':
                setjumlahService1(item.key_value)
                break
              case 'service2':
                setService2(item.key_value)
                break
              case 'jumlah_service2':
                setjumlahService2(item.key_value)
                break
              case 'service3':
                setService3(item.key_value)
                break
              case 'jumlah_service3':
                setjumlahService3(item.key_value)
                break
              case 'about':
                setAbout(item.key_value)
                break
              case 'telp':
                setNoTelp(item.key_value)
                break
              case 'alamat':
                setAlamat(item.key_value)
                break
              case 'linkGps':
                setLinkGps(item.key_value)
                break
              default:
                break;
            }
          })
          console.log(data);
          
      } catch (error) {
        console.log(error);
        
      }
    }
    getData()
    getDataPorto()
    getDataTesti()
    getSiteSettings()
  }, [res, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)

    if (selectedFile) {
      const preview = URL.createObjectURL(selectedFile)
      setPreviewUrl(preview)
    } else {
      setPreviewUrl(null)
    }
  }

  return (
    <div>
      <Navbar/>
      <div className="mt-25 mx-10">
        {session ? (<h1 className={`${poppinsSB.className} text-[32px]`}>Selamat Datang!</h1>) : (
          <p>loading..</p>
        )}
        <div className={`${poppins.className} flex flex-wrap justify-between border-b border-b-1 border-[#4F2916] mt-10`}>
          <button className={`${siteSetIsActive ? `bg-[#4F2916] text-white py-2 w-50 shadow-sm`: `text-black py-2 w-50`} rounded-sm mb-2`} onClick={() => {
            setSiteSetIsActive(true)
            setPortoIsActive(false)
            setProductIsActive(false)
            setTestiIsActive(false)
          }}>Site settings</button>
          <button className={`${productIsActive ? `bg-[#4F2916] text-white py-2 w-50 shadow-sm`: `text-black py-2 w-50`} rounded-sm mb-2`} onClick={() => {
            setSiteSetIsActive(false)
            setPortoIsActive(false)
            setProductIsActive(true)
            setTestiIsActive(false)
          }}>Product</button>
          <button className={`${portoIsActive ? `bg-[#4F2916] text-white py-2 w-50 shadow-sm`: `text-black py-2 w-50`} rounded-sm mb-2`} onClick={() => {
            setSiteSetIsActive(false)
            setPortoIsActive(true)
            setProductIsActive(false)
            setTestiIsActive(false)
          }}>Portofolio</button>
          <button className={`${testiIsActive ? `bg-[#4F2916] text-white py-2 w-50 shadow-sm`: `text-black py-2 w-50`} rounded-sm mb-2`} onClick={() => {
            setSiteSetIsActive(false)
            setPortoIsActive(false)
            setProductIsActive(false)
            setTestiIsActive(true)
          }}>Testimoni</button>
        </div>
        {/* ===============PRODUCT======================== */}
        <div className={`${productIsActive ? `block` : `hidden`} flex flex-col mt-5 py-5`}>
          {editProdIsActive ? (
            <h2 className={`${poppinsSB.className} text-[20px] py-3 pb-5`}>Edit Product</h2>
          ) : <h2 className={`${poppinsSB.className} text-[20px] py-3 pb-5`}>Tambah Product</h2>}
          <div className="flex justify-center">
            <div className="flex flex-col">
              <input className={`${poppins.className} lg:w-200 md:w-150 sm:w-100 w-80 bg-[#4F2916] text-white py-1 px-3 rounded-md`}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {previewUrl && (
                <div className="">
                  <p className="text-sm text-gray-500">Preview:</p>
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={160} // karena w-40 = 160px
                    height={160} // boleh disamakan, atau sesuaikan dengan rasio gambar
                    className="rounded shadow object-cover"
                  />
                </div>
              )}
              <label className={`mt-4 ${poppins.className}`} htmlFor="">Harga</label>
              <input type="text" placeholder="Rp. 94.000" className={`${poppins.className} px-5 lg:w-200 md:w-150 sm:w-100 w-80 py-1 border border-gray-500 rounded-md rounded-md`} value={harga} onChange={(e) => setHarga(e.target.value)}/>
              <label className={`mt-4 ${poppins.className}`}>Detail Produk</label>
              {descs.map((d, i) => (
                <div key={i} className="flex items-start gap-2 mb-2">
                  <textarea
                    className={`py-1 border border-gray-500 rounded-md lg:w-200 md:w-150 sm:w-100 w-80 ${poppins.className} px-5`} placeholder="Masukkan detail produk anda. Contoh: bebas revisi.. Jika anda memiliki lebih dari 1 detail, silahkan klik tombol tambah detail di bawah"
                    value={d}
                    onChange={(e) => handleDescChange(i, e.target.value)}
                  />
                  {descs.length > 1 && (
                  <button className="text-red-500 border border-red-500 px-1 py-1 rounded-md" onClick={() => removeDescField(i)}>
                    <Trash className="w-4 h-4"/>
                  </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addDescField}
                className={`${poppins.className} text-sm w-fit py-2 text-white px-5 bg-[#4F2916] rounded-md`}
              >
                + Tambah detail
              </button>
              {editProdIsActive ? (
                <button onClick={()=> handleUpdate(id)} className={`${poppins.className} py-2 rounded-md bg-[#4F2916] text-white mt-8`}>Edit</button>
              ): (
                <button onClick={handleSubmit} className={`${poppins.className} py-2 rounded-md bg-[#4F2916] text-white mt-8`}>Simpan</button>
              )}

            </div>
          </div>
          <h2 className={`${poppinsSB.className} text-[20px] mt-15`}>Products</h2>
          <div className="overflow-x-auto">
            <div className="flex justify-between border-b border-b-gray-400 whitespace-nowrap min-w-[700px]">
              <div className={`${poppins.className} flex w-58 justify-between`}>
                <p>Preview</p>
                <p>Harga</p>
                <p>Deskripsi</p>

              </div>
              <p className={`${poppins.className}`}>Aksi</p>
            </div>
            {datas?.map((item) => (
              <div
                key={item.id}
                className={`flex justify-between items-center border-b border-gray-300 py-2 border-b border-b-gray-400 ${poppins.className} min-w-[700px]`}
              >
                {/* Preview image */}

                <div className="w-16 h-16 relative">
                  <Image
                    src={item?.img_url}
                    alt="preview"
                    fill
                    className="object-cover rounded"
                  />
                </div>

                {/* Harga */}
                <p className="w-24 text-center">{item.harga}</p>

                {/* Deskripsi */}
                <ul className="flex-1 px-2">
                  {Array.isArray(item.desc) ? (
                    item.desc.map((d: string, i: number) => (
                      <li key={i} className="truncate text-sm">• {d}</li>
                    ))
                  ) : (
                    <li className="truncate text-sm">{item.desc}</li>
                  )}
                </ul>


                {/* Aksi (misalnya tombol edit/hapus) */}
                <div className="flex space-x-2">
                  <button onClick={() => {setEditProdIsActive(true)
                    getById(item.id, 'product')
                    setId(item.id)
                  }} className="text-blue-500 border border-blue-500 px-1 py-1 rounded-md">
                    <Pencil className="w-4 h-4"/>
                  </button>
                  <button onClick={() => deleteData(item.id, 'product', 'productimg')} className="text-red-500 border border-red-500 px-1 py-1 rounded-md">
                    <Trash className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* ===============PORTOFOLIO======================== */}
        <div className={`${portoIsActive ? `block` : `hidden`} flex flex-col mt-5 rounded-md py-5`}>
          {editPortoIsActive ? (
            <h2 className={`${poppinsSB.className} text-[20px] py-3 pb-5`}>Edit Portofolio</h2>
          ) : (
            <h2 className={`${poppinsSB.className} text-[20px] py-3 pb-5`}>Tambah Portofolio</h2>
          )}
          <div className="flex justify-center">
            <div className="flex flex-col">
              <input className={`${poppins.className} bg-[#4F2916] lg:w-200 md:w-150 sm:w-100 w-80 text-white py-1 px-3 rounded-md`}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {previewUrl && (
                <div className="">
                  <p className="text-sm text-gray-500">Preview:</p>
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={160} // karena w-40 = 160px
                    height={160} // boleh disamakan, atau sesuaikan dengan rasio gambar
                    className="rounded shadow object-cover"
                  />
                </div>
              )}
              <label className={`mt-4 ${poppins.className}`} htmlFor="">Judul</label>
              <input type="text" placeholder="Contoh: Projek dari PT Mencari cinta sejati" className={`${poppins.className} lg:w-200 md:w-150 sm:w-100 w-80 py-1 border border-gray-500 px-5 rounded-md`} value={desc1} onChange={(e) => setDesc1(e.target.value)}/>
              <label className={`mt-4 ${poppins.className}`} htmlFor="">Deskripsi Singkat</label>
              <textarea placeholder="berikan deskripsi singkat" className={`${poppins.className} lg:w-200 md:w-150 sm:w-100 w-80 py-1 border border-gray-500 px-5 rounded-md`} value={desc2} onChange={(e) => setDesc2(e.target.value)}/>
              {editPortoIsActive ? (
                <button onClick={() => updatePortofolio(id)} className={`${poppins.className} py-2 rounded-md bg-[#4F2916] text-white mt-8`}>Edit</button>
              ) : (
                <button onClick={handleSubmitPorto} className={`${poppins.className} py-2 rounded-md bg-[#4F2916] text-white mt-8`}>Simpan</button>
              )}
            </div>
          </div>
          <h2 className={`${poppinsSB.className} text-[20px] mt-15`}>Portofolio</h2>
          <div className="overflow-x-auto">
            <div className="flex justify-between border-b border-b-gray-400 whitespace-nowrap min-w-[700px]">
              <div className={`${poppins.className} flex w-67 justify-between`}>
                <p>Preview</p>
                <p>Judul</p>
                <p>Deskripsi</p>

              </div>
              <p className={`${poppins.className}`}>Aksi</p>
            </div>
            {portos?.map((item) => (
              <div
                key={item.id}
                className={`flex justify-between items-center border-b border-gray-300 py-2 border-b border-b-gray-400 ${poppins.className} min-w-[700px]`}
              >
                {/* Preview image */}
                <div className="w-16 h-16 relative">
                  <Image
                    src={item?.img_url}
                    alt="preview"
                    fill
                    className="object-cover rounded"
                  />
                </div>

                {/* Harga */}
                <p className="w-32 text-center">{item.desc1}</p>

                {/* Deskripsi */}
                <p className="flex-1 px-2">{item.desc2}</p>

                {/* Aksi (misalnya tombol edit/hapus) */}
                <div className="flex space-x-2">
                  <button onClick={() => {
                    setEditPortoIsActive(true)
                    getByIdPorto(item.id)
                    setId(item.id)
                  }} className="text-blue-500 border border-blue-500 px-1 py-1 rounded-md">
                    <Pencil className="w-4 h-4"/>
                  </button>
                  <button onClick={() => {
                    deleteData(item.id, 'portofolio', 'portoimg')}} className="text-red-500 border border-red-500 px-1 py-1 rounded-md">
                    <Trash className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* ===============Testimoni======================== */}
        <div className={`${testiIsActive ? `block` : `hidden`} flex flex-col mt-5 rounded-md py-5`}>
          {editTestiIsActive ? (
            <h2 className={`${poppinsSB.className} text-[20px] py-3 pb-2`}>Edit Testimoni</h2>
          ) : (
            <h2 className={`${poppinsSB.className} text-[20px] py-3 pb-2`}>Tambah Testimoni</h2>
          )}
          <div className="flex justify-center">
            <div className="flex flex-col">
              <label className={`${poppins.className}`} htmlFor="">Headline</label>
              <input type="text" placeholder="Contoh: Kami sangat puas" className="lg:w-200 md:w-150 sm:w-100 w-80 px-5 py-1 border border-gray-500 rounded-md" value={headline} onChange={(e) => setHeadline(e.target.value)}/>
              <label className={`mt-4 ${poppins.className}`} htmlFor="">Testimoni</label>
              <textarea placeholder="Contoh: Kami sangat puas dengan hasil kerja drafter aja.." className="lg:w-200 md:w-150 sm:w-100 w-80 px-5 py-1 border border-gray-500 rounded-md" value={testi} onChange={(e) => setTesti(e.target.value)}/>
              <label className={`mt-4 ${poppins.className}`} htmlFor="">Nama</label>
              <input type="text" placeholder="PT Pete" className="lg:w-200 md:w-150 sm:w-100 w-80 px-5 py-1 border border-gray-500 rounded-md" value={nama} onChange={(e) => setNama(e.target.value)}/>
              {editTestiIsActive ? (
                <button onClick={() => updateTesti(id)} className={`${poppins.className} py-2 rounded-md bg-[#4F2916] text-white mt-8`}>Edit</button>
              ) : (
                <button onClick={handleSubmitTesti} className={`${poppins.className} py-2 rounded-md bg-[#4F2916] text-white mt-8`}>Simpan</button>
              )}
            </div>
          </div>
          <h2 className={`${poppinsSB.className} text-[20px] mt-15`}>Testimoni</h2>
          <div className="overflow-x-auto">
            {/* Judul kolom */}
            <div className={`${poppins.className} flex justify-between border-b border-b-gray-400 py-2 whitespace-nowrap min-w-[700px]`}>
              <div className="w-40">
                <p>Headline</p>
              </div>
              <div className="w-40">
                <p>Testimoni</p>
              </div>
              <div className="flex-1">
                <p>Nama</p>
              </div>
              <div className="w-32 flex justify-end">
                <p>Aksi</p>
              </div>
            </div>

            {/* Data */}
            {testies?.map((item) => (
              <div
                key={item.id}
                className={`${poppins.className} flex justify-between border-b border-gray-300 py-2 min-w-[700px]`}
              >
                {/* Headline */}
                <div className="w-40">
                  <p>{item.headline}</p>
                </div>

                {/* Harga */}
                <div className="w-40">
                  <p>{item.testi}</p>
                </div>

                {/* Deskripsi */}
                <div className="flex-1">
                  <p className="truncate">{item.nama}</p>
                </div>

                {/* Aksi */}
                <div className="flex space-x-2 items-center">
                  <button onClick={() => {
                    setId(item.id)
                    getByIdTesti(item.id)
                    setEditTestiIsActive(true)
                  }} className="text-blue-500 border border-blue-500 px-1 py-1 rounded-md">
                    <Pencil className="max-w-4 max-h-4"/>
                  </button>
                  <button onClick={async() => {
                    try {
                      const response = await supabase
                      .from('testimoni')
                      .delete()
                      .eq('id', item.id)
                      setRes(res + 1)
                      if(response){
                        showToast.success("Testimoni baru berhasil dihapus!", {
                          duration: 4000,
                          progress: true,
                          position: "top-center",
                          transition: "bounceIn",
                          icon: '',
                          sound: true,
                        });
                      }
                      
                    } catch (error) {
                      console.log(error);
                      
                    }
                  }} className="text-red-500 border border-red-500 px-1 py-1 rounded-md">
                    <Trash className="max-w-4 max-h-4"/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* ===============Site Settings======================== */}
        <div className={`${siteSetIsActive ? `block` : `hidden`} flex flex-col mt-5 rounded-md py-5`}>
          <h2 className={`${poppinsSB.className} text-[20px] ml-8 py-3 pb-5`}>Site Settings</h2>
          <div className="flex justify-center">
            <div className="flex flex-col">
              <label className={`${poppins.className}`} htmlFor="">Telah Melayani 1</label>
              <input type="text" className={`mb-3 ${poppins.className} px-5 lg:w-200 md:w-150 sm:w-100 w-80 py-1 border border-gray-500 rounded-md`} value={service1} onChange={(e) => setService1(e.target.value)}/>

              <label className={`${poppins.className}`} htmlFor="">Jumlah yang Telah Dilayani 1</label>
              <input type="text" className={`mb-3 ${poppins.className} px-5 lg:w-200 md:w-150 sm:w-100 w-80 py-1 border border-gray-500 rounded-md`} value={jumlahService1} onChange={(e) => setjumlahService1(e.target.value)}/>

              <label className={`${poppins.className}`} htmlFor="">Telah Melayani 2</label>
              <input type="text" className={`mb-3 ${poppins.className} px-5 lg:w-200 md:w-150 sm:w-100 w-80 py-1 border border-gray-500 rounded-md`} value={service2} onChange={(e) => setService2(e.target.value)}/>

              <label className={`${poppins.className}`} htmlFor="">Jumlah yang Telah Dilayani 2</label>
              <input type="text" className={`mb-3 ${poppins.className} px-5 lg:w-200 md:w-150 sm:w-100 w-80 py-1 border border-gray-500 rounded-md`} value={jumlahService2} onChange={(e) => setjumlahService2(e.target.value)}/>

              <label className={`${poppins.className}`} htmlFor="">Telah Melayani 3</label>
              <input type="text" className={`mb-3 ${poppins.className} px-5 lg:w-200 md:w-150 sm:w-100 w-80 py-1 border border-gray-500 rounded-md`} value={service3} onChange={(e) => setService3(e.target.value)}/>

              <label className={`${poppins.className}`} htmlFor="">Jumlah yang Telah Dilayani 3</label>
              <input type="text" className={`mb-3 ${poppins.className} px-5 lg:w-200 md:w-150 sm:w-100 w-80 py-1 border border-gray-500 rounded-md`} value={jumlahService3} onChange={(e) => setjumlahService3(e.target.value)}/>

              <label className={`${poppins.className}`} htmlFor="">Tentang Kami</label>
              <textarea className={`mb-3 px-5 lg:w-200 md:w-150 sm:w-100 w-80 h-60 py-1 border border-gray-500 rounded-md ${poppins.className} `} value={about} onChange={(e) => setAbout(e.target.value)}/>

              <label className={`${poppins.className}`} htmlFor="">No Telp (awali dengan 62)</label>
              <input type="text" className={`mb-3 ${poppins.className} px-5 lg:w-200 md:w-150 sm:w-100 w-80 py-1 border border-gray-500 rounded-md`} value={noTelp} onChange={(e) => setNoTelp(e.target.value)}/>

              <label className={`${poppins.className}`} htmlFor="">Alamat</label>
              <input type="text" className={`mb-3 ${poppins.className} px-5 lg:w-200 md:w-150 sm:w-100 w-80 py-1 border border-gray-500 rounded-md`} value={alamat} onChange={(e) => setAlamat(e.target.value)}/>

              <label className={`${poppins.className}`} htmlFor="">Link GPS</label>
              <input type="text" className={`mb-3 ${poppins.className} px-5 lg:w-200 md:w-150 sm:w-100 w-80 py-1 border border-gray-500 rounded-md`} value={linkGps} onChange={(e) => setLinkGps(e.target.value)}/>

              <button onClick={handleUpdtSite} className={`${poppins.className} py-2 rounded-md bg-[#4F2916] text-white mt-8`}>Simpan</button>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
