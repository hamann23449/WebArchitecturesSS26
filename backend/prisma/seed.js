const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
	console.log('Seeding database with sample artists, genres and albums...')

	// clear existing (ignore errors)
	await prisma.rating.deleteMany().catch(() => {})
	await prisma.album.deleteMany().catch(() => {})
	await prisma.artist.deleteMany().catch(() => {})
	await prisma.genre.deleteMany().catch(() => {})
	await prisma.user.deleteMany().catch(() => {})

	// genres
	const rock = await prisma.genre.create({ data: { name: 'Rock' } })
	const pop = await prisma.genre.create({ data: { name: 'Pop' } })
	const jazz = await prisma.genre.create({ data: { name: 'Jazz' } })

	// artists
	const artist1 = await prisma.artist.create({ data: { name: 'The Example Band' } })
	const artist2 = await prisma.artist.create({ data: { name: 'Sample Singer' } })
	const artist3 = await prisma.artist.create({ data: { name: 'Smooth Jazzers' } })
	const radiohead = await prisma.artist.create({ data: { name: 'Radiohead' } })
	const bjork = await prisma.artist.create({ data: { name: 'Björk' } })
	const miles = await prisma.artist.create({ data: { name: 'Miles Davis' } })

	// albums
	const albums = [
		{
			title: 'First Sounds',
			artistId: artist1.id,
			genreId: rock.id,
			release_year: 2010,
			tracklist: JSON.stringify([
				{ title: 'Intro', duration: '1:02' },
				{ title: 'Main Theme', duration: '3:45' },
				{ title: 'Slow Interlude', duration: '4:20' }
			])
		},
		{
			title: 'Pop Hits',
			artistId: artist2.id,
			genreId: pop.id,
			release_year: 2018,
			tracklist: JSON.stringify([
				{ title: 'Hit One', duration: '3:15' },
				{ title: 'Hit Two', duration: '2:58' },
				{ title: 'Ballad', duration: '4:05' }
			])
		},
		{
			title: 'Evening Jazz',
			artistId: artist3.id,
			genreId: jazz.id,
			release_year: 2005,
			tracklist: JSON.stringify([
				{ title: 'Night Walk', duration: '5:12' },
				{ title: 'Moonlight', duration: '6:03' }
			])
		},
		{
			title: 'OK Computer',
			artistId: radiohead.id,
			genreId: rock.id,
			release_year: 1997,
			tracklist: JSON.stringify([
				{ track: 1, title: 'Airbag', duration: '4:44' },
				{ track: 2, title: 'Paranoid Android', duration: '6:23' },
				{ track: 3, title: 'Subterranean Homesick Alien', duration: '4:27' }
			])
		},
		{
			title: 'Homogenic',
			artistId: bjork.id,
			genreId: pop.id,
			release_year: 1997,
			tracklist: JSON.stringify([
				{ track: 1, title: 'Hunter', duration: '5:15' },
				{ track: 2, title: 'Jóga', duration: '5:07' }
			])
		},
		{
			title: 'Kind of Blue',
			artistId: miles.id,
			genreId: jazz.id,
			release_year: 1959,
			tracklist: JSON.stringify([
				{ track: 1, title: 'So What', duration: '9:22' },
				{ track: 2, title: 'Freddie Freeloader', duration: '9:46' }
			])
		}
	]

	for (const a of albums) {
		await prisma.album.create({ data: a })
	}

	console.log('Seeding finished.')
}

main()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})

