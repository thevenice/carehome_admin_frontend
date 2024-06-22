import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import DocumentsTable from '../components/Tables/DocumentsTable'
import DefaultLayout from '../layout/DefaultLayout'

const Documents = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Documents" />

      <div className="flex flex-col gap-10">
        <DocumentsTable />
      </div>
    </DefaultLayout>
  )
}

export default Documents
