import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import CareHomeTable from '../components/Tables/CareHomeTable'
import DefaultLayout from '../layout/DefaultLayout'

const CareHomes = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="CareHomes" />

      <div className="flex flex-col gap-10">
        <CareHomeTable />
      </div>
    </DefaultLayout>
  )
}

export default CareHomes
