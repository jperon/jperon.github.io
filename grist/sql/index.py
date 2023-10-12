grist.ready({"requiredAccess": "full", "allowSelectBy": True})

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


key = document.querySelector("#key")
query = document.querySelector("#query")
q = document.querySelector("#q")
reply = document.querySelector("#reply")

async def ctrl_enter(evt):
  if evt.ctrlKey and evt.which == 13:
    api = await grist.docApi.getAccessToken({"readOnly": True})
    opts = __new__(window.Object)
    url = f"{api.baseUrl}/sql?q={query.value}"
    if key.value:
      opts.headers = __new__(window.Object)
      opts.headers.Authorization = f"Bearer {key.value}"
    else:
      url += f"&auth={api.token}"
    data = await fetch(url, opts).then(lambda x: x.json())
    if data.records:
      if data.records[0]:
        header = dict(data.records[0].fields).keys()
        aoa = [
          [JSON.stringify(row.fields[fname], null, 2) for fname in header]
          for row in data.records
        ]
        create_table('reply', aoa, header)
        document.querySelector("#csv").value = ",".join(header) + "\n" + "\n".join([",".join(row) for row in aoa])
        print(document.querySelector("#csv").value)
        if 'id' in header:
          await grist.setSelectedRows([row.fields['id'] for row in data.records])
      else:
        reply.innerHTML = "No result."
    else:
      console.warn("ERR\n", data)
      reply.innerHTML = data.error
    evt.preventDefault()
query.addEventListener("keydown", ctrl_enter)

def download(filename, text):
  element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)

window.download = download

