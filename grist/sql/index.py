grist.ready({"requiredAccess": "full"})

def create_table(id, data, header):
  table = document.createElement("table")
  thead = document.createElement("thead")
  tr = document.createElement("tr")

  for head in header:
    th = document.createElement("th")
    th.appendChild(document.createTextNode(head))
    tr.appendChild(th)
  thead.appendChild(tr)
  tbody = document.createElement("tbody")

  for row in data:
    tr = document.createElement("tr")
    for cell in row:
      td = document.createElement("td")
      td.appendChild(document.createTextNode(cell))
      tr.appendChild(td)
    tbody.appendChild(tr)
  table.appendChild(thead)
  table.appendChild(tbody)
  document.getElementById(id).firstChild.replaceWith(table)


query = document.querySelector("#query")
q = document.querySelector("#q")
reply = document.querySelector("#reply")

async def ctrl_enter(evt):
  if evt.ctrlKey and evt.which == 13:
    api = await grist.docApi.getAccessToken({"readOnly": True})
    data = await fetch(
      f"{api.baseUrl}/sql?auth={api.token}&q={query.value}"
    ).then(lambda x: x.json())
    header = dict(data.records[0].fields).keys()
    aoa = ((
        JSON.stringify(row.fields[fname], null, 2) for fname in header
    ) for row in data.records)
    create_table('reply', aoa, header)
    evt.preventDefault()
query.addEventListener("keydown", ctrl_enter)

