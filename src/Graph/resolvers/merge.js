// const { chunk, flatten } = require('lodash')
// const DataLoader = require('dataloader')

// // LOADERS
// const albumLoader = new DataLoader(albumIds => {
//   const promises = albumIds.map(getAlbumPromise)
//   return Promise.all(promises)
// })

// const artistAlbumsLoader = new DataLoader(artistIds => {
//   const promises = artistIds.map(id =>
//     apiInstance.getArtistAlbums(id)
//       .then(res => res.items.map(transformAlbum)))
//   return Promise.all(promises)
// })

// const artistsLoader = new DataLoader(artistIds => {
//   const promises = artistIds.map(id =>
//     apiInstance.getArtistById(id)
//       .then(res => transformArtist(res)))
//   return Promise.all(promises)
// })

// const trackLoader = new DataLoader(trackIds => {
//   const chunks = chunk(trackIds, 10)
//   const promises = chunks.map(chunksIds => apiInstance.getTracks({
//     ids: chunksIds
//   })
//     .then(({ tracks }) => tracks.map(transformTrack)))
//   return Promise.all(promises).then(res => flatten(res))
// })

// const lyricsLoader = new DataLoader(lyricsParams => {
//   const promises = lyricsParams.map(params => apiInstanceGenius.getLyrics(params))
//   return Promise.all(promises)
// })

// const previewUriLoader = new DataLoader(previewParams => {
//   const promises = previewParams.map(params => apiInstanceDeezer.getPreview(params))
//   return Promise.all(promises)
// })

// const getAlbumPromise = async id => {
//   try {
//     return await apiInstance.getAlbumById(id)
//       .then(res => transformAlbum(res))
//   } catch (err) {
//     throw err
//   }
// }

// const transformTrack = (track, market) => {
//   const {
//     id,
//     duration_ms: duration,
//     explicit,
//     available_markets: availableMarkets,
//     name,
//     popularity,
//     uri,
//     preview_url: previewUri,
//     album,
//     artists
//   } = track
//   return {
//     type: 'Track',
//     id,
//     duration,
//     explicit,
//     name,
//     ...{ ...market && { isAvailableCountry: availableMarkets.includes(market) } },
//     availableMarkets,
//     popularity,
//     previewUri,
//     previewUriDezeer: () => previewUriLoader.load(({ artistName: artists[0].name, trackName: name, albumName: album.name })),
//     uri,
//     album: () => albumLoader.load(album.id),
//     artists: () => artistsLoader.loadMany(artists.map(({ id }) => id)),
//     lyrics: () => lyricsLoader.load({ artistName: artists[0].name, trackName: name })
//   }
// }

// const transformAlbum = (album, market) => {
//   const { id, genres, images, name, release_date: releaseDate, popularity, tracks = [] } = album
//   return {
//     type: 'Album',
//     id,
//     genres,
//     images,
//     name,
//     releaseDate,
//     popularity,
//     tracks: () => trackLoader.loadMany(tracks.items.map(({ id }) => id))
//   }
// }

// const transformArtist = (artist) => {
//   const { id, genres, images, name, popularity } = artist
//   return {
//     type: 'Artist',
//     id,
//     genres,
//     images,
//     name,
//     popularity,
//     albums: () => artistAlbumsLoader.load(id)
//   }
// }

// exports.transformTrack = transformTrack
// exports.transformAlbum = transformAlbum
// exports.transformArtist = transformArtist
