import Foundation

@objc public class EchoPlugin: NSObject {
    @objc public func echo(_ value: String) -> String {
        print("Echo plugin received: \(value)")
        return value
    }
}