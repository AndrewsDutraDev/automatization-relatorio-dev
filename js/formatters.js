var POsNames = [
  "Eduarda Lopes",
  "Jéssica Lemes",
  "Natália Kolm",
  "Gabriela Mello",
];

export function formatTaskName(taskName){
	let taskNameSplit = taskName.split('|')
	// taskNameSplit = taskNameSplit[0].replace(' ', '')
	return taskNameSplit[0]
}

export function formatTaskPoints(taskPoints){
	let taskPointsSplit = taskPoints.split('|')
	// taskPointsSplit = taskPointsSplit[1].replace(' ', '')
	return taskPointsSplit[1]
}

export function formatTaskFront(nameFrontPO){
	let name
	if (nameFrontPO){
		for (let POname of POsNames){
			if (nameFrontPO.includes(POname)){
				name = nameFrontPO.replace(POname, '')
				name = name.replace(',', '')
				name = name.replace(' ', '')
			}
		}
		return name
	}
}

export function formatDateEnd(date){
	let newdate
	date = date.toLowerCase()
	console.log('dateaaa', date)
	if (date){
		if (date.includes('ontem') || date.includes('hoje') || date.includes('atrás')){
			if (date.includes('ontem')){
				console.log('ontem')
				newdate = moment().subtract(1, 'days');
			}
			if (date.includes('hoje')){
				console.log('hoje')
				newdate = moment();
			}
			if (date.includes('atrás')){
				let dataString = date.split('dias')
				dataString = dataString[0].replace(' ', '')
				console.log('atrás', dataString)
				newdate = moment().subtract(parseInt(dataString), 'days');

				console.log('newdate atras', newdate)
			}
			newdate = newdate.format('DD/MM/YYYY');
		}else{
			newdate = date
		}
		
		return newdate
	}
}