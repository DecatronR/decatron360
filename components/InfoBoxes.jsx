import InfoBox from './InfoBox';

const InfoBoxes = () => {
  return (
    <section>
      <div className='container-xl lg:container m-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg'>
          <InfoBox
            heading='Buyer and Renters'
            backgroundColor='bg-gray-100'
            buttonInfo={{
              text: 'Browse Properties',
              link: '/properties',
              backgroundColor: 'bg-black',
            }}
          >
            Find your dream rental property. Bookmark properties and contact owners.
          </InfoBox>
          <InfoBox
            heading='Owners and Agents'
            backgroundColor='bg-primary-100'
            buttonInfo={{
              text: 'Add Property',
              link: '/properties/add',
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

export default InfoBoxes;
