'use strict'

document.getElementById('frmSearch').addEventListener('submit', function(e) {
	e.preventDefault();
	let postalCodes = document.getElementById('postalCodes').value.trim().split('\n').map(v => v.trim());
	// let htmlRows = postalCodes.map(code => {
	// 	let html = '';

	// 	html += `<tr>`;
	// 	html += `<td>${code}</td>`;
	// 	html += `<td>?</td>`;
	// 	html += `<td>?</td>`;
	// 	html += `</tr>`;

	// 	return html;
	// }).join('');

	let obj = {};
	Promise.map(postalCodes, (code) => {
		return new Promise(function(resolve, reject) {
			if (!code) return resolve({lat: 'NA', lng: 'NA'})

			superagent.get(`https://maps.googleapis.com/maps/api/geocode/json?address=singapore+${code}&key=AIzaSyAiJKpaQbRJds5N2YGMKWqkikkBCqek2bk`)
				.end(function(err, res) {
					if (err) return reject(err);

					let results = res.body.results;
					let result = results.find(res => res && res.geometry && res.geometry.location); 

					setTimeout(() => {
						resolve(result ? result.geometry.location : {lat: '?', lng: `"${code}"`});	
					}, 500);
				});

		}).then(coords => obj[code] = coords)
	}, {concurrency: 5})
		.then(() => {
			let htmlRows = postalCodes.map(code => {
				let html = '';

				html += `<tr>`;
				html += `<td>${code}</td>`;
				html += `<td>${obj[code].lat}</td>`;
				html += `<td>${obj[code].lng}</td>`;
				html += `</tr>`;

				return html;
			}).join('');

			document.getElementById('tblResultsBody').innerHTML = htmlRows
		})
		.catch(console.error);

	return false;
});