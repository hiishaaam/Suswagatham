const fs = require('fs');
const path = require('path');
const https = require('https');

const screens = [
  {
    title: "Christian Wedding RSVP",
    screenshot: "https://lh3.googleusercontent.com/aida/ADBb0ugd85cIpzBz1wC-PpazeQlrOZwwX-LC51cqSqmuENCNQdIIqbv4yK2ZER7jZHmSub-033MOE7RNc0MAVGFQS4_9VQPFmrFYqQ8CBC1r989_k7pbyZlvAVhxWk0-cYGkVPPwfHHG2U2im6LBqpx--3EujhnR7NV9aWRW76sm4JnM6RHmbS68-eJZHTtxfoNa-j5mu7EneGQTqXZfBg3OXyHEyYW5LvWUBwgLUm1cyHBCIQ5LnE4okdomOEOj",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzhjM2MwNzQ4ZmY0YTQ4ZjI4ZDFhNDMyMmRjYzQ3NTM4EgsSBxCYt8uK9x8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNzM5MDQ5MzQ1NzA3NDYwMTI1NA&filename=&opi=89354086"
  },
  {
    title: "Muslim Wedding RSVP",
    screenshot: "https://lh3.googleusercontent.com/aida/ADBb0uhp70uyYBzrGtHzpXE3WuKM3fAsR0v6DXAjA7SK8TGpIVKHmL1JDZ2UxYahMxV_QcEDGrar41FrsPM5DJe6-sT2ep2eZk0rtMRLurEJ3Ezlo8HrcPcCPxuDyKflb2kjzHk4OX3td2VKl9h0v_9dkxDGtfUMQP6nRUdhajrjslruibfTf-SlpmiHrHOXpmtCIv9dd8G1BY6zKKr4BtCWZUEZ8fVBhzLLNMmps449eAp8sM0WLAv2Kesb-Fg",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzM2NTdhOGZhMmYyODQ0ODQ4ODI3ZDFhYzk0N2MzNmFmEgsSBxCYt8uK9x8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNzM5MDQ5MzQ1NzA3NDYwMTI1NA&filename=&opi=89354086"
  },
  {
    title: "Birthday RSVP",
    screenshot: "https://lh3.googleusercontent.com/aida/ADBb0ujnnrM85cCeOmFinnF7fZd9MeIhtBM8On7NKthTFmyN6M1InRkaJVOzFS-nk4y6XMjY77zQW0KooApdz_55GC8SHL4V9j8JwnpUG2XbibSZiBIKWoEOlAu7vGgEyfQD9EMcQFND7mT7JLoMdPEDodMdDZ-_NVkPg5miEx1mZKr73sod5S529F9F82KHWfOuc3Ynmj0oOLEHM8udqDc-iXGqDrjAWBT14Y-Ee7Jp_blm2vHlk7TpXwWkCzg",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzIwNWZhMWYyOTg1NzQ1MzI5OGFjMGZhN2Y3YmQxNzg1EgsSBxCYt8uK9x8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNzM5MDQ5MzQ1NzA3NDYwMTI1NA&filename=&opi=89354086"
  },
  {
    title: "Sikh Wedding RSVP",
    screenshot: "https://lh3.googleusercontent.com/aida/ADBb0uiC_ABvxcReooNgvU636HEiGq8Fr1aB4pOvhDU7I5n_udRTYP3RZv7hFy0Sn3n-xYBdPtQY5aPF0N32_UeqdzoPeitxKxTYyvWIRNOwzZ7IsJjJh0ZXnptBSCWsE1RAWh-kXzMf1mhrDYV6YWN5BS2BG2jS0XTDSJgh8ybSo0HhUfpR6nC0iab3zFrw4td0PKc23oy4KaF_iztB9hd4uyLmsLS6f3heibWKj_wqmCjJHje8PTDuQJgr_4o",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2I1NWM1ZWVmMjExYzQ3MDM4YmM0MmQxOTFhMDljZDY5EgsSBxCYt8uK9x8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNzM5MDQ5MzQ1NzA3NDYwMTI1NA&filename=&opi=89354086"
  },
  {
    title: "Hindu Wedding RSVP",
    screenshot: "https://lh3.googleusercontent.com/aida/ADBb0uguzLAl079Ih08RWtazMEI0sOcj8DeQjlPj0SBGS2lMcwbsFKVF6B4GbyCqVtC2u7eTbew0I26u4G-KAZUiubJjn1JqKPJR6GPL2IxpAQXVSn7weI1b3Bl1b1ATpMUiu4ClQH3UzyUlQdM1BuQTjuk4d3OMjsbsEmZBS6YaSRM8cMwyIPTbU2sz8adzD5hmrHlS2cPyReVmA66t4utYjQTtASqmbPs4uLtO94xva0FsYH_S9K63Pv-C9A8",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2E0OWM5YjMzN2MxODRhOTU5MzFiYzI5NzJhYzU2MjkzEgsSBxCYt8uK9x8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNzM5MDQ5MzQ1NzA3NDYwMTI1NA&filename=&opi=89354086"
  },
  {
    title: "Hindu Wedding Invitation",
    screenshot: "https://lh3.googleusercontent.com/aida/ADBb0ugE3pL2g0h_CINQuK-rxCu2skPTrEzsjMNftjqDRWPZyTExti_X03ovD66lGdvHjRbcqMIx8f-zlUHS2G5wwX0kQ2FRgIQixpypaZTOnQbKdfTEziTlMVUrHcOwNgdUkrUjOcGAJwOl0fpMQU16rYXxBUgDqsByfieQI_77J51ZnvuUwOcCbdKsnAlzg9p49JF_tMA49f7FQH-fnj-k8DXUMUD95q4XpfxCwdCvene2x88DT1KU5Rgy3iA",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzM1OTcyOGE3ODQ3ZjQ0YWNhMzk4NzBjMzQ4YjE2MDM3EgsSBxCYt8uK9x8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNzM5MDQ5MzQ1NzA3NDYwMTI1NA&filename=&opi=89354086"
  },
  {
    title: "Christian Wedding Invitation",
    screenshot: "https://lh3.googleusercontent.com/aida/ADBb0ug1-41Tf7BVwFzDbyHzoJroH67tUtNCO2vzH6Vzhu5_PxXR5nIdA8LKiuugOd1Oi7OdcwDkmMTkhQonWTCFWNk7K7MytcAt0rC1OQyHa4XmqKMdxqMAZrNI5BU4sN8mFtjMFBGloKdX6ro7bwICdZYHEL8Ka0wVigWeFvImjAkWUCbva8C6ZrqPSP0k0GgCvCE_gIt0iPHvf7BGIganed7eVkKxlQKRcbQP_sWGThCwrlAdcUADjN5bPaZT",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzFjMTE2MjQxM2Y3NTRiYWI4NGYwNDFlNTgwNDE1NzNmEgsSBxCYt8uK9x8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNzM5MDQ5MzQ1NzA3NDYwMTI1NA&filename=&opi=89354086"
  },
  {
    title: "Muslim Wedding Invitation",
    screenshot: "https://lh3.googleusercontent.com/aida/ADBb0ujvlOovlxK5VNh2UMjkU4eQTYYqu48v3j2qaEANLT9MEITY9gGh7D9Nn9eL2D-Hr-1ylplOkLIkXXdJKAKG50nDgecbls8kZ3TOd74pD85oyEZpcyS7xOzGs74-frAAG1Tu1lu0NILhkjPiLvtyP90F5R88LFuen05KxTcCSZe-74P4gz_LjFA2-qc3an7yujMAXr2F2PeyG1eNbc0oZ94HbaFafOH_NHCwXaAOohwJZSam_Xlc0tSa73Q",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzU5ZmViZTI4ZjQ1ODRiMGZhZGFiYmNmN2I4YTU5NmU4EgsSBxCYt8uK9x8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNzM5MDQ5MzQ1NzA3NDYwMTI1NA&filename=&opi=89354086"
  },
  {
    title: "Muslim Wedding Location Reveal",
    screenshot: "https://lh3.googleusercontent.com/aida/ADBb0ugOc5p5LYIoMoFGAimqpwhDjL7TKarfT9gyhgtr3_IDw5cqkWpdKISnj_EX2EnoMjl4LwWtYRJaq2lRO6cDBpKep3UofvdYF9FYYRTzESIHxpviiRNpGozqPBnNnWksxIIIv6BlHaehl3OkmP2eBlJD550E_2baddGkJs2YuAdY2YOWEw8LTgIzQ-nBGam-LvlLSWw59jVHmWgMmGuyTATecVFv2PhhF3wxnCr7ri1zJH9FR4tYs6OSgwoZ",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzQ3ODUwNDcwZWIzMzQ1NDRhN2I2MjQzYTJjZmViZDUxEgsSBxCYt8uK9x8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNzM5MDQ5MzQ1NzA3NDYwMTI1NA&filename=&opi=89354086"
  },
  {
    title: "Christian Wedding Location Reveal",
    screenshot: "https://lh3.googleusercontent.com/aida/ADBb0uipJdm1_itPHl0enKpGrreF7Aj77yYCxw7HbY5z2RRmviE3XtKihFoH-WUYznTJVRen6VDiYGv548vngOoq8YHMGueMKmljl-ay6NPkMsD_WxtvL6kKEI_xoAveO1vEJXyUIiq9I_GNfi0tlgDsh6JsmJFsgZiEBMK-Zn4tbnP6zvF8Rf-HQi118IA_QgwKy4UHkwQIkosl1zOsd7qfj9uc_GSgPyBeknuunjDKfZL-cMLPb1_kHnrvVUY",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzQzNGY2OGUyNjA2MzRiNDliYWM2Mzg5NjU1YWU4YmVmEgsSBxCYt8uK9x8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNzM5MDQ5MzQ1NzA3NDYwMTI1NA&filename=&opi=89354086"
  },
  {
    title: "Hindu Wedding Location Reveal",
    screenshot: "https://lh3.googleusercontent.com/aida/ADBb0ug0VRvozAXn2Ojnu6gAAK_YdLA9Jqn2mXVFN_MEEFr0G7Xgi9mQ_6DlwVW-R43hlnhl56o2k8oXLujm636hNQLmuHWsXnFLutn9tPywc7K-hjXGsRsf-hjr73vVoVV1E8q8jlaHIZNTytE9FUzQ2p4TIYTP747YhQ5MSULluILX3exi-Rg3OoKvQCopSzS2xp-Bl7-V_9GC6TE06EI1YQeZzpNs1dVEyervhXHdh6F6two5Pi3WWU9g82x2",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzMxYmI0YTlkYmE1MzRjZGFiM2NhNGVhYmIzMWUxMDdjEgsSBxCYt8uK9x8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNzM5MDQ5MzQ1NzA3NDYwMTI1NA&filename=&opi=89354086"
  },
  {
    title: "Sikh Wedding Location Reveal",
    screenshot: "https://lh3.googleusercontent.com/aida/ADBb0ugc_9IwatRZio80mpZrf5C-zEGBuzwWrdYXoVRgv21cm_zQ5nxyxAw9wLzqNyWI3OU5PaRSpoQpJg7No7xeYfgCOGGgS6iorQmQtvc_6gthcvbU8-t2Whwvre-WP9Z1w3Pb_OvolhlG4nu1POX92x-YJXW0nXRpGQThcK7P4Q_v__sdLVNvIzHJKxiN7F3V2SvV5hyklHKTV9pS_t8ZlbGW8VdqD--k8-UGdn7ow_86fcYlJzTrMwCJiqxT",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2MzZDNlYTNjOTlmNjRkZTI5OTY0MTNlYjU1ODk4NThhEgsSBxCYt8uK9x8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNzM5MDQ5MzQ1NzA3NDYwMTI1NA&filename=&opi=89354086"
  },
  {
    title: "Birthday Location Reveal",
    screenshot: "https://lh3.googleusercontent.com/aida/ADBb0uhsY5IZJcrsFC9bhTu9oz7p47eCpbk_kL_Rs455RjHeDgYtgc5_8_umkBebBv-301TJV7mjk2GdiQWhPz1zphItAXo5vjW-mQ9SyCIFESNPe-YNZ3wZ1YCQJ2mKHvcbys1lsUuRqoDpKyuCIk2kOEPLf1sWfIQn_6P9Zvq3v0MlLCUuuIPQAfnpy8hEfOp-ZCfOwE23-3Q3Ubc3Cgd2Ugv0Uc6rLBAMWQUNRgsYITFl5auDoYTzxgi4ksh7",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzRjYmMxNDU4NzRlODQ3ZGJiMzBmNjVhZGU5ZWQzNGYxEgsSBxCYt8uK9x8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNzM5MDQ5MzQ1NzA3NDYwMTI1NA&filename=&opi=89354086"
  },
  {
    title: "Birthday Invitation",
    screenshot: "https://lh3.googleusercontent.com/aida/ADBb0ugcIMLVGbcm7gf7gAg26a6IVKmkuOSZYwjaINe7hNXA5f9qwJGr5i6PahFP-SnQwojW2rz4mAK_HlIwX06gfSCtINPFUsaGEW413s1MRl-_dnHcoFdx0R5dnBrTnGEACfVLXGHTgkN6BnD0uzvCnBqK83ZcjbtZqBOYa_NtJ0z5h5BxMhzbREVbh-j0bdVaz8wueOL0lM6M6k_ZjOa37FvgTywIwLz53ovmph0tt603LCyVp-FCk1RJN-ul",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzdiZTdhMTA1OTQ5MjRhZmJiMjI3M2ViNjg3OTQ1ZjFhEgsSBxCYt8uK9x8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNzM5MDQ5MzQ1NzA3NDYwMTI1NA&filename=&opi=89354086"
  },
  {
    title: "Sikh Wedding Invitation",
    screenshot: "https://lh3.googleusercontent.com/aida/ADBb0ug4efucvNY1bNiGrfEInlJM-1H-YoZR1uH5Eh7Igg8mBVgpTPbWCKBsLU1_4cwvoUdVu5QqDcLSRfsK2tQweiFFagn0NZBAiUFffBWMMffZkgasrbwwn6tYSRuNM522T192VnK69NZnBU3f7KGHj9mjj2o1WE87dGEekzhr-MPdq7Xw27A3QO83XVA88dwnW1uQE4eKWMCKN27Glccpu4bODKvGwxzpSKFBgXQ3Y6U3K3C4pnVJp8Tgw6E",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2MyZDM4MmJlZjVmYjRmNTRhOGI1YWM3Y2IyYjMxMTVhEgsSBxCYt8uK9x8YAZIBJAoKcHJvamVjdF9pZBIWQhQxNzM5MDQ5MzQ1NzA3NDYwMTI1NA&filename=&opi=89354086"
  }
];

const TARGET_DIR = path.join(__dirname, 'stitch_templates');
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function start() {
  console.log(`Starting massive async download of ${screens.length} Stitch artifacts...`);
  
  for (let i = 0; i < screens.length; i++) {
    const screen = screens[i];
    const safeTitle = screen.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const folderPath = path.join(TARGET_DIR, safeTitle);
    
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    
    console.log(`Downloading [${i+1}/${screens.length}] ${screen.title}...`);
    
    try {
      // Append high-resolution sizing params to Google User Content URLs to prevent blurry 312px crops!
      let highResScreenshot = screen.screenshot;
      if (highResScreenshot.includes('googleusercontent.com')) {
        highResScreenshot += '=w1200'; // Force 1200px width high-res webp
      }

      await Promise.all([
        downloadFile(screen.html, path.join(folderPath, 'index.html')),
        downloadFile(highResScreenshot, path.join(folderPath, 'screenshot.webp'))
      ]);
      console.log(`✓ Saved ${safeTitle}`);
    } catch (err) {
      console.error(`✗ Failed ${screen.title}:`, err);
    }
  }
  
  console.log('🎉 All Stitch designs downloaded to /stitch_templates');
}

start();
