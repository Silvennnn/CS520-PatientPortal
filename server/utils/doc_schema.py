# import logging
# from collections import defaultdict
#
# from server.schemas import
#
#
# class KeyDict(defaultdict):
#     def __missing__(self, key):
#         return key
#
#
# type_convert = KeyDict(number="integer", array="list")
#
#
# def create_filter_schema(name, title, type):
#     # print(name, title, type)
#     if str(type) == "array":
#         return {
#             "required": False,
#             "schema": {"title": title, "type": "array", "items": {"type": "string"}},
#             "name": str(name),
#             "in": "query",
#         }
#     return {
#         "required": False,
#         "schema": {"title": title, "type": type_convert[str(type)]},
#         "name": str(name),
#         "in": "query",
#     }
#
#
# def add_filter_param(schema, api_path, filter_class):
#     for name, info in filter_class.schema()["properties"].items():
#         schema["paths"][api_path]["get"]["parameters"].append(
#             create_filter_schema(name, info["title"], info["type"])
#         )
#
#
# def add_doc_schema(schema):
#     add_filter_param(schema, "/user/providing", FilterProvidingItem)
#     return schema