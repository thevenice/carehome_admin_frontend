import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '../layout/DefaultLayout'
import CoverOne from '../images/cover/cover-01.png'
import CreateDocumentForm from '../components/Forms/CreateDocument'

const CreateDocumentProfile = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Create User Profile" />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-35 md:h-65">
          <img
            src={CoverOne}
            alt="cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          />
        </div>
        <div className="w-full">
          <CreateDocumentForm />
        </div>
      </div>
    </DefaultLayout>
  )
}

export default CreateDocumentProfile
