import { Company } from '../../types';

interface CompanyDetailsProps {
  company: Company;
}

export function CompanyDetails({ company }: CompanyDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Company Name</h4>
          <p className="mt-1 text-sm text-gray-900">{company.name}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Location</h4>
          <p className="mt-1 text-sm text-gray-900">{company.location}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">LinkedIn Profile</h4>
          <a
            href={company.linkedinProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 text-sm text-indigo-600 hover:text-indigo-900"
          >
            {company.linkedinProfile}
          </a>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Communication Periodicity</h4>
          <p className="mt-1 text-sm text-gray-900">{company.communicationPeriodicity} days</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-500">Email Addresses</h4>
        <ul className="mt-1 space-y-1">
          {company.emails.map((email, index) => (
            <li key={index} className="text-sm text-gray-900">
              {email}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-500">Phone Numbers</h4>
        <ul className="mt-1 space-y-1">
          {company.phoneNumbers.map((phone, index) => (
            <li key={index} className="text-sm text-gray-900">
              {phone}
            </li>
          ))}
        </ul>
      </div>

      {company.preferredMethods && company.preferredMethods.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-500">Preferred Communication Methods</h4>
          <ul className="mt-1 space-y-1">
            {company.preferredMethods.map((method, index) => (
              <li key={index} className="text-sm text-gray-900">
                {method}
              </li>
            ))}
          </ul>
        </div>
      )}

      {company.comments && (
        <div>
          <h4 className="text-sm font-medium text-gray-500">Comments</h4>
          <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{company.comments}</p>
        </div>
      )}
    </div>
  );
} 