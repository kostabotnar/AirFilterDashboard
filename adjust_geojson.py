import json

import numpy as np

region_shift = {
    1: np.array((6, 2)),
    2: np.array((3, 2)),
    3: np.array((2, 0)),
    4: np.array((3, -4)),
    5: np.array((2, 4)),
    6: np.array((0, 0)),
    7: np.array((0, 1)),
    8: np.array((-3, 2)),
    9: np.array((-4, -2)),
    10: np.array((-7, 2))
}

def PolyArea(points):
    x = [p[0] for p in points]
    y = [p[1] for p in points]
    return 0.5*np.abs(np.dot(x,np.roll(y,1))-np.dot(y,np.roll(x,1)))

def filter_biggest_objects(feature, n=1):
    # find a polygon with the biggest area
    areas = [0 if len(polygon[0]) == 0 else PolyArea(polygon[0]) for polygon in feature['geometry']['coordinates']]

    max_ind = np.argpartition(areas, -n)[-n:]
    # drop all other polygons
    for i, polygon in enumerate(feature['geometry']['coordinates']):
        if i not in max_ind and polygon[0]:
            polygon[0] = []

def filter_smallest_objects(feature, n=1):
    # find a polygon with the biggest area
    areas = [np.inf if len(polygon[0]) == 0 else PolyArea(polygon[0]) for polygon in feature['geometry']['coordinates']]

    min_ind = np.argpartition(areas, -n)[:n]
    # drop all other polygons
    for i, polygon in enumerate(feature['geometry']['coordinates']):
        if i not in min_ind and polygon[0]:
            polygon[0] = []



def main():
    # read json file
    with open('data/geojson/fema-maps-master/FEMA_Regions_edited.geojson', 'r') as f:
        geo_data = json.load(f)
    # loop through the geojson data and shift region coordinates
    for i, feature in enumerate(geo_data['features']):
        region_id = feature['properties']['Region']
        # shift = region_shift.get(region_id, (0, 0))
        # if feature['geometry']['type'] == 'Polygon':
        #     new_coordinates = np.array(feature['geometry']['coordinates'][0]) + shift
        #     new_coordinates = [list(coord) for coord in new_coordinates]
        #     geo_data['features'][i]['geometry']['coordinates'][0] = new_coordinates
        # if feature['geometry']['type'] == 'MultiPolygon':
        #     for polygon in feature['geometry']['coordinates']:
        #         new_coordinates = np.array(polygon[0]) + shift
        #         new_coordinates = [list(coord) for coord in new_coordinates]
        #         polygon[0] = new_coordinates
        # drop islands except alaska
        if region_id in (2,9):
            filter_biggest_objects(feature)
        if region_id == 10:
            filter_biggest_objects(feature, 2)
            filter_smallest_objects(feature)
        feature['properties']['Region'] = f"REGION {region_id}"


    # save the dictionary to a json file
    with open('build/edited_fema_regions.geojson', 'w') as f:
        json.dump(geo_data, f)


if __name__ == "__main__":
    main()
