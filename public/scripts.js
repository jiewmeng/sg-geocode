'use strict'

document.getElementById('frmSearch').addEventListener('submit', function(e) {
	let tblBody = document.getElementById('tblResultsBody');
	tblBody.innerHTML = ''
	e.preventDefault();
	let postalCodes = document.getElementById('postalCodes').value.trim().split('\n').map(v => v.trim());

	let obj = {};
	let numCodes = postalCodes.length;
	let done = 0;
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
					} : {lat: '?', lng: `?`});	
				}, 2000);
			});
		}).then((coords) => {
			let html = '';
			html += `<tr>`;
			html += `<td>${code}</td>`;
			html += `<td>${coords.lat}</td>`;
			html += `<td>${coords.lng}</td>`;
			html += `</tr>`;

			tblBody.innerHTML += html;
			done++;
		}).then(() => document.getElementById('progress').MaterialProgress.setProgress((done*100)/numCodes))
	}, {concurrency: 2})
		.catch(err => console.error(err));

	return false;
});