import { useState } from 'react'

const FeaturesSection = () => {
    const features = [
        {
            title: "Talk it out",
            description: "Say what’s on your mind—big, small, messy. Core doesn’t judge.",
            imageLeft: true,
        },
        {
            title: "Bring your chaos",
            description: "Overthinking? Rambling? Perfect. That’s what this is for.",
            imageLeft: false,
        },
        {
            title: "Zero effort",
            description: "No instructions, no learning curve. Open, start, done.",
            imageLeft: true,
        },
        {
            title: "Always on your time",
            description: "3 AM rant? Midday vent? We’re always open.",
            imageLeft: false,
        },
    ]

    return (
        <section className="bg-[#FAF7F2] py-8">
            <div className="max-w-5xl mx-auto px-6">
                {/* Section Heading */}
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
                    all good stuff
                </h2>


                <div className="space-y-4">
                    {features.map((feature, idx) => (
                        <article
                            key={idx}
                            className={`flex flex-col md:flex-row items-center gap-4 p-3 rounded-2xl bg-white border border-gray-200 ${idx % 2 !== 0 ? "md:flex-row-reverse" : ""
                                }`}
                        >
                            {/* Text Section */}
                            <div className="w-full md:w-1/2 flex flex-col justify-center text-left pl-2 md:pl-4">
                                <h4 className="font-bold text-2xl text-gray-900 mb-1">
                                    {feature.title}
                                </h4>
                                <p className="max-w-[420px] text-gray-500 font-medium leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>

                            {/* Image/Placeholder Section */}
                            <div className="w-full md:w-1/2">
                                <div className="w-full bg-gray-300 rounded-2xl min-h-[320px] md:min-h-[320px]" />
                            </div>
                        </article>
                    ))}
                </div>





            </div>
        </section>
    )
}

export default FeaturesSection
