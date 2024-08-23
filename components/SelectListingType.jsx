import InfoBox from './InfoBox';

const SelectListingType = () => {
  return (
    <section>
      <div className='container-xl lg:container m-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg'>
          <InfoBox
            heading='Properties For Sale'
            backgroundColor='bg-gray-100'
            buttonInfo={{
              text: 'Sell',
              link: '/properties/add/for-sale',
              backgroundColor: 'bg-black',
            }}
          >
            Find your dream rental property. Bookmark properties and contact owners.
          </InfoBox>
          <InfoBox
            heading='Properties for Rent & Shortlet'
            backgroundColor='bg-primary-100'
            buttonInfo={{
              text: 'Rent and Shortlet',
              link: '/properties/add/for-rent',
              backgroundColor: 'bg-primary-500',
            }}
          >
            List your properties and reach potential tenants. Rent short or long term.
          </InfoBox>
        </div>
      </div>
    </section>
  );
};

export default SelectListingType;
