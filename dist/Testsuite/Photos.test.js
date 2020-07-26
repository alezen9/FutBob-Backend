// import assert from 'assert'
// import dotenv from 'dotenv'
// import { getVillageName } from '../Utils/helpers'
// import { get, isEmpty } from 'lodash'
// dotenv.config()
// const _host = process.env.API_URL || 'http://localhost:5000/api'
// const _self = new DDreamkolServer(_host)
// const albumName = 'Nerezi'
// const notExistingAlbum = 'Hello World_thisAlbum doesn\'t exist'
// describe('PHOTOS', () => {
//     let albumId: string
//     let after: string
//     let before: string
//     it('Given an album name should retrieve the id for that album if exists', async () => {
//         const res = await _self.getAlbumIdByName(albumName)
//         const { data, error } = res
//         const _name = getVillageName(albumName)
//         albumId = get(data, 'id', null)
//         assert.equal(get(data, 'name', null), _name)
//         assert.equal(typeof albumId, 'string')
//         assert.equal(error, null)
//     })
//     it('[Fail] Given a non existing album name should give error', async () => {
//         const res = await _self.getAlbumIdByName(notExistingAlbum)
//         const { data, error } = res
//         const _name = getVillageName(notExistingAlbum)
//         assert.equal(get(data, 'name', null), _name)
//         assert.equal(get(data, 'id', null), null)
//         assert.equal(error, null)
//     })
//     it('[Fail] no "name" field in body should give error', async () => {
//         const res = await _self.getAlbumIdByName(null)
//         const { data, error } = res
//         assert.equal(isEmpty(data), true)
//         assert.equal(get(error, 'message', null), 'child name must be string')
//     })
//     it('Given an album id should retrieve the media for that album', async () => {
//         const res = await _self.getAlbumById({ id: albumId })
//         const { data, error } = res
//         assert.equal(!isEmpty(data), true)
//         assert.equal(get(data, 'id', null), albumId)
//         assert.equal(typeof get(data, 'id', null), 'string')
//         assert.equal(get(error, null), null)
//     })
//     it('[Fail] no "id" field in body should give error', async () => {
//         const res = await _self.getAlbumById({})
//         const { data, error } = res
//         assert.equal(isEmpty(data), true)
//         assert.equal(get(error, 'message', null), 'child id is required')
//     })
//     it('TO REFACTOR Retrive first page of media given an "id" and save after cursor if present', async () => {
//         const res = await _self.getAlbumById({ id: albumId })
//         const { data, error } = res
//         if(get(data, 'photos.paging.cursors.after', null)) {
//             after = get(data, 'photos.paging.cursors.after', null)
//             const res2 = await _self.getAlbumById({ id: albumId, pagination: { after } })
//             assert.equal(!!get(res2, 'data.photos.paging.cursors.before', null), true)
//         }
//         // assert.equal(!isEmpty(data), true)
//         // assert.equal(get(data, 'id', null), albumId)
//         // assert.equal(typeof get(data, 'id', null), 'string')
//         // assert.equal(get(error, null), null)
//     })
// })
//# sourceMappingURL=Photos.test.js.map