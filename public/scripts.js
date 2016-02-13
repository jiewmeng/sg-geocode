'use strict'

document.getElementById('frmSearch').addEventListener('submit', function(e) {
	e.preventDefault();
	let postalCodes = document.getElementById('postalCodes').value.trim().split('\n').map(v => v.trim());

	let obj = {};
	let geocoder = new google.maps.Geocoder();
	Promise.map(postalCodes, (code) => {
		return new Promise(function(resolve, reject) {
			if (!code) return resolve({lat: 'NA', lng: 'NA'})

			geocoder.geocode({ address: `Singapore ${code}` }, function(results, status) {
				if (status !== google.maps.GeocoderStatus.OK) return reject(status);

				console.log(results)
				let result = results.find(res => res && res.geometry && res.geometry.location); 

				setTimeout(() => {
					resolve(result ? {
						lat: result.geometry.location.lat(),
						lng: result.geometry.location.lng(),
					} : {lat: '?', lng: `"${code}"`});	
				}, 1000);
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
		.catch(err => console.error(err));

	return false;
});