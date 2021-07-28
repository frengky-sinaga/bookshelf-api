const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload

	if (!name || name.length === 0) {
		return h
			.response({
				status: 'fail',
				message: 'Gagal menambahkan buku. Mohon isi nama buku',
			})
			.code(400)
	}

	if (readPage > pageCount) {
		return h
			.response({
				status: 'fail',
				message:
					'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
			})
			.code(400)
	}

	const id = nanoid(16)
	const finished = pageCount === readPage
	const insertedAt = new Date().toISOString()
	const updatedAt = insertedAt
	const newBook = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished,
		reading,
		insertedAt,
		updatedAt,
	}
	books.push(newBook)

	const isSuccess = books.filter((book) => book.id === id).length > 0
	if (isSuccess) {
		return h
			.response({
				status: 'success',
				message: 'Buku berhasil ditambahkan',
				data: {
					bookId: id,
				},
			})
			.code(201)
	}

	return h
		.response({
			status: 'error',
			message: 'Buku gagal ditambahkan',
		})
		.code(500)
}

const getAllBooksHandler = (request, h) => {
	const { name, reading, finished } = request.query
	let filteredBooks = books

	if (name) {
		filteredBooks = filteredBooks.filter((book) =>
			book.name.toLowerCase().includes(name.toLowerCase())
		)
	}

	if (reading) {
		const readingStatus = reading === '1'
		filteredBooks = filteredBooks.filter(
			(book) => book.reading === readingStatus
		)
	}

	if (finished) {
		const finishedStatus = finished === '1'
		filteredBooks = filteredBooks.filter(
			(book) => book.finished === finishedStatus
		)
	}

	if (books.length !== 0) {
		const booksSaved = filteredBooks.map((book) => ({
			id: book.id,
			name: book.name,
			publisher: book.publisher,
		}))

		return h
			.response({
				status: 'success',
				data: {
					books: booksSaved,
				},
			})
			.code(200)
	}

	return h
		.response({
			status: 'success',
			data: {
				books: [],
			},
		})
		.code(200)
}

const getBookByIdHandler = (request, h) => {
	const { bookId } = request.params

	const book = books.filter((bookDetail) => bookDetail.id === bookId)[0]

	if (book !== undefined) {
		const response = h
			.response({
				status: 'success',
				data: {
					book: {
						id: book.id,
						name: book.name,
						year: book.year,
						author: book.author,
						summary: book.summary,
						publisher: book.publisher,
						pageCount: book.pageCount,
						readPage: book.readPage,
						finished: book.finished,
						reading: book.reading,
						insertedAt: book.insertedAt,
						updatedAt: book.updatedAt,
					},
				},
			})
			.code(200)
		return response
	}

	return h
		.response({
			status: 'fail',
			message: 'Buku tidak ditemukan',
		})
		.code(404)
}

const editBookByIdHandler = (request, h) => {
	const { bookId } = request.params

	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload

	if (!name || name.length === 0) {
		return h
			.response({
				status: 'fail',
				message: 'Gagal memperbarui buku. Mohon isi nama buku',
			})
			.code(400)
	}

	if (readPage > pageCount) {
		return h
			.response({
				status: 'fail',
				message:
					'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
			})
			.code(400)
	}

	const updatedAt = new Date().toISOString()

	const index = books.findIndex((book) => book.id === bookId)

	if (index !== -1) {
		books[index] = {
			...books[index],
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			reading,
			updatedAt,
		}
		return h
			.response({
				status: 'success',
				message: 'Buku berhasil diperbarui',
			})
			.code(200)
	}

	return h
		.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Id tidak ditemukan',
		})
		.code(404)
}

const deleteNoteByIdHandler = (request, h) => {
	const { bookId } = request.params

	const index = books.findIndex((book) => book.id === bookId)

	if (index !== -1) {
		books.splice(index, 1)

		return h
			.response({
				status: 'success',
				message: 'Buku berhasil dihapus',
			})
			.code(200)
	}

	return h
		.response({
			status: 'fail',
			message: 'Buku gagal dihapus. Id tidak ditemukan',
		})
		.code(404)
}

module.exports = {
	addBookHandler,
	getAllBooksHandler,
	getBookByIdHandler,
	editBookByIdHandler,
	deleteNoteByIdHandler,
}
