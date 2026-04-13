/**
 * Privacy Policy Page
 * Shusmo Games privacy policy information
 */
function Privacy() {
  return (
    <section className="min-h-screen px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-shusmo-black mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600">Shusmo Games</p>
        </div>

        {/* Introduction */}
        <div className="card p-8 md:p-12 mb-8">
          <p className="text-lg text-gray-600 leading-relaxed mb-4">
            This Privacy Policy applies to all products, services, and websites offered by Shusmo Games.
            We may provide product-specific privacy notices to explain our products in more detail.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at:{' '}
            <a
              href="mailto:business@Shusmo.io"
              className="text-shusmo-yellow hover:underline font-medium"
            >
              business@Shusmo.io
            </a>
          </p>
        </div>

        {/* Information We Collect */}
        <div className="card p-8 md:p-12 mb-8">
          <h2 className="text-2xl font-bold text-shusmo-black mb-6">
            Information We Collect and How We Use It
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            We may collect the following types of information:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-shusmo-black mb-3">
                Information You Provide
              </h3>
              <p className="text-gray-600 leading-relaxed">
                When you sign up for our products, we may ask for personal information such as your name, email, or zip code.
                We may combine the information you provide to improve your experience and enhance the quality of our products.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-shusmo-black mb-3">
                Location Data
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We offer location-enabled services and products.
                If you use these, we may collect information about your actual location or approximate location.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-shusmo-black mb-3">
                Crash and Usage Data
              </h3>
              <p className="text-gray-600 leading-relaxed">
                If you use our Android products, we may collect anonymous crash reports and usage data from your device and applications.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-shusmo-black mb-3">
                Other Sites
              </h3>
              <p className="text-gray-600 leading-relaxed">
                This Privacy Policy applies only to Shusmo Games services, products, and websites.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
            <p className="text-lg font-semibold text-shusmo-black mb-4">
              We may use collected information to:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-shusmo-yellow mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Provide, maintain, protect, and improve our services</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-shusmo-yellow mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Develop new services</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-shusmo-yellow mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Protect the rights and property of our users</span>
              </li>
            </ul>
          </div>

          <p className="text-gray-600 leading-relaxed mt-6">
            If we use this information for purposes other than those originally stated, we will request your consent beforehand.
          </p>

          <p className="text-gray-600 leading-relaxed mt-4">
            Shusmo Games Ltd processes personal information on servers located in the United States and other countries.
            In some cases, your data may be processed outside your home country.
          </p>
        </div>

        {/* Information Sharing */}
        <div className="card p-8 md:p-12 mb-8">
          <h2 className="text-2xl font-bold text-shusmo-black mb-6">
            Information Sharing
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Shusmo Games Ltd only shares personal information with other companies or individuals in the following cases:
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-shusmo-yellow mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-shusmo-black">With your consent</p>
                <p className="text-gray-600">We require opt-in consent for sharing sensitive personal information.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-shusmo-yellow mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-shusmo-black">With trusted partners</p>
                <p className="text-gray-600">We may share data with subsidiaries, affiliated companies, or trusted third parties who process information on our behalf under strict confidentiality and security obligations.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-shusmo-yellow mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-shusmo-black">For legal reasons</p>
                <p className="text-gray-600 mb-2">We may access, use, or disclose information if necessary to:</p>
                <ul className="space-y-1 text-gray-600 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-shusmo-yellow">•</span>
                    <span>Comply with laws or legal processes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-shusmo-yellow">•</span>
                    <span>Enforce Terms of Service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-shusmo-yellow">•</span>
                    <span>Detect or prevent fraud, security, or technical issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-shusmo-yellow">•</span>
                    <span>Protect the rights, property, or safety of Shusmo, its users, or the public</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed mt-6">
            If Shusmo Games is involved in a merger, acquisition, or asset sale, we will ensure the confidentiality of personal data and provide notice before any transfer.
          </p>
        </div>

        {/* Information Security */}
        <div className="card p-8 md:p-12 mb-8">
          <h2 className="text-2xl font-bold text-shusmo-black mb-6">
            Information Security
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            We take appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of data.
            These include:
          </p>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-shusmo-yellow mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600">Internal reviews of data practices</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-shusmo-yellow mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600">Encryption and secure storage</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-shusmo-yellow mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600">Physical security measures</span>
            </li>
          </ul>

          <p className="text-gray-600 leading-relaxed">
            Access to personal information is limited to employees, contractors, and agents who need it to perform their duties.
            They are bound by confidentiality obligations and may face disciplinary action if they fail to comply.
          </p>
        </div>

        {/* Changes to Policy */}
        <div className="card p-8 md:p-12 mb-8">
          <h2 className="text-2xl font-bold text-shusmo-black mb-6">
            Changes to This Privacy Policy
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">
            This Privacy Policy may be updated from time to time.
            We will not reduce your rights without your explicit consent.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Any changes will be posted on this page.
            If changes are significant, we will provide a more prominent notice, such as email notification where applicable.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-600 font-medium">Last version</p>
          <p className="text-gray-500 mt-2">©️ Shusmo.io</p>
        </div>
      </div>
    </section>
  )
}

export default Privacy
