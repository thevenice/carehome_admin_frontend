import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import PlansTable from '../components/Tables/PlansTable'
import DefaultLayout from '../layout/DefaultLayout'

const Plans = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Plans" />

      <div className="flex flex-col gap-10">
        <PlansTable />
      </div>
    </DefaultLayout>
  )
}

export default Plans
