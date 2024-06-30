import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import CarePlanTable from '../components/Tables/CarePlansTable'
import DefaultLayout from '../layout/DefaultLayout'

const CarePlans = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="CarePlans" />

      <div className="flex flex-col gap-10">
        <CarePlanTable />
      </div>
    </DefaultLayout>
  )
}

export default CarePlans
