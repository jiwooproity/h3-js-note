# 구현을 위해 사용된 라이브러리 ..
- Uber H3-JS
- Map Render / leaflet

# 4.x.x 변경된 메소드 내역 확인 링크

**Note :** https://github.com/facebook/create-react-app](https://h3geo.org/docs/library/migration-3.x/functions/)https://h3geo.org/docs/library/migration-3.x/functions/

# 메모
|함수명|설명|
|------|--------|
|latLngToCell( lat, lng, res )|위도와 경도, 크기 값을 기준으로 h3 값을 반환|
|cellToLatLng( cell )|h3 값을 기준으로 위도, 경도에 대한 값을 number[] 값으로 반환|
|gridDisk( h, k )|h3 값을 기준으로 k 거리만큼의 셀 인덱스들을 생성|

|오브젝트|설명|
|------|--------|
|MapContainer|맵 생성을 위한 영역을 생성|
|TileLayer|맵 영역에 생성할 지도 이미지 생성을 위한 오브젝트|
|Marker|number[] lat, lng 값을 기준으로 위치 아이콘을 생성|
|Polyline|지정된 latLng[] 값을 기준으로 선을 연결|
|Polygon|number[] cell 데이터로 맵 위에 폴리곤을 생성|

|이벤트|설명|
|------|--------|
|useMap|상호작용을 위한 이벤트를 생성 가능|
|useMapEvent|MapContainer 안에 생성이 가능하며, 생성 시 맵 위에서 일어나는 이벤트를 감지 및 트리거 동작|
